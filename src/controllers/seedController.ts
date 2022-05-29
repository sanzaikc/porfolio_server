import { Request, Response, NextFunction } from "express";
import { faker } from "@faker-js/faker";

import { BlogInput } from "./../models/blogModel";
import { flairEnums } from "./../models/blogModel";
import AppError from "../utils/AppError";
import Blog from "../models/blogModel";
import catchAsync from "../utils/catchAsync";

export const seedBlog = async () => {
  const blogSeeds: BlogInput[] = [];

  for (let index = 0; index < 20; index++) {
    const blog = {
      title: faker.name.findName(),
      content: `<p>${faker.lorem.paragraph()}</p>`,
      flair: flairEnums[Math.floor(Math.random() * flairEnums.length)],
    };

    blogSeeds.push(blog);
  }

  await Blog.deleteMany();
  await Blog.insertMany(blogSeeds);
};

export const seedModel = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    switch (req.params.model) {
      case "blog":
        await seedBlog();
        break;

      default:
        return next(new AppError("Invalid model", 404));
    }

    res.json({
      status: "success",
      message: `${req.params.model.toUpperCase()} model successfully seed`,
    });

    next();
  }
);
