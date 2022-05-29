import { Request, Response, NextFunction } from "express";

import { BlogInput } from "./../models/blogModel";
import Blog from "../models/blogModel";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/AppError";

export const seedBlog = async () => {
  const blogSeeds: BlogInput[] = [
    {
      title: "Blog 1",
      content: "This is a blog",
      flair: "article",
    },
    {
      title: "Blog 2",
      content: "This is a blog 2",
      flair: "notes",
    },
    {
      title: "Blog 3",
      content: "This is a blog 3",
      flair: "facts",
    },
  ];

  await Blog.deleteMany();
  await Blog.insertMany(blogSeeds);
};

export const seedModel = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.params.model);

    switch (req.params.model) {
      case "blog":
        await seedBlog();
        break;

      default:
        return next(new AppError("Invalid model", 404));
    }

    res.json({
      status: "success",
      message: "Seeded successfully",
    });
    ``;
    next();
  }
);
