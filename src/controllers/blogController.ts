import { Request, Response, NextFunction } from "express";
import fs from "fs";
import multer from "multer";
import sharp from "sharp";

import { multerFilter } from "../utils/multerFilter";
import * as factory from "./factoryHandler";
import Blog from "../models/blogModel";
import AppError from "../utils/AppError";
import catchAsync from "../utils/catchAsync";

const imageDestination = "public/img/blogs/";
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: multerFilter,
});

export const uploadCoverImage = upload.single("coverImage");

export const resizeCoverImage = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  if (!fs.existsSync(imageDestination))
    fs.mkdirSync(imageDestination, { recursive: true });

  sharp(req.file.buffer)
    .resize(2000, 1300, { fit: "cover" })
    .jpeg({ quality: 90 })
    .toFile(`${imageDestination}${req.file.filename}`);

  // Including the image path
  req.body.coverImage = `${req.protocol}://${
    req.headers.host
  }/${imageDestination.replace("public/", "")}${req.file.filename}`;

  next();
};

export const getFeaturedBlogs = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const featuredBlogs = await Blog.find({ featured: true });

    res.status(200).json({
      status: "success",
      data: featuredBlogs,
      total_items: featuredBlogs.length,
    });
  }
);

export const getBySlug = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const blog = await Blog.findOne({ slug: req.params.slug });

    if (!blog)
      return next(new AppError("Cannot find blog with that slug", 404));

    res.status(200).json({
      status: "success",
      data: blog,
    });
  }
);

// factory methods
export const getAllBlogs = factory.getAll(Blog);

export const getBlog = factory.getOne(Blog);

export const createBlog = factory.createOne(Blog);

export const updateBlog = factory.updateOne(Blog);

export const deleteBlog = factory.deleteOne(Blog);
