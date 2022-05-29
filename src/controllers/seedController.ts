import { Request, Response, NextFunction } from "express";
import { faker } from "@faker-js/faker";

import { BlogInput } from "./../models/blogModel";
import { flairEnums } from "./../models/blogModel";
import { UserInput } from "./../models/userModel";
import AppError from "../utils/AppError";
import Blog from "../models/blogModel";
import catchAsync from "../utils/catchAsync";
import User from "../models/userModel";

const seedBlogs = async () => {
  const blogs: BlogInput[] = [];

  for (let index = 0; index < 20; index++) {
    const blog = {
      title: faker.name.findName(),
      content: `<p>${faker.lorem.paragraph()}</p>`,
      flair: flairEnums[Math.floor(Math.random() * flairEnums.length)],
    };

    blogs.push(blog);
  }

  await Blog.deleteMany();
  await Blog.insertMany(blogs);
};

const seedUsers = async (excludeDelete: string) => {
  const users: UserInput[] = [];

  for (let index = 0; index < 20; index++) {
    const user = {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: "password",
      passwordConfirm: "password",
    };

    users.push(user);
  }

  await User.deleteMany({ _id: { $ne: excludeDelete } });
  await User.insertMany(users);
};

export const seedModel = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    switch (req.params.model) {
      case "blog":
        await seedBlogs();
        break;

      case "user":
        await seedUsers(req.user.id);
        break;

      default:
        return next(new AppError("Invalid model", 404));
    }

    res.json({
      status: "success",
      message: `${req.params.model.toUpperCase()} model successfully seed`,
    });
  }
);
