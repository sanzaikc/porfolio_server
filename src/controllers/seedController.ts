import { Request, Response, NextFunction } from "express";
import { faker } from "@faker-js/faker";

import { BlogInput } from "./../models/blogModel";
import { flairEnums } from "./../models/blogModel";
import { UserInput } from "./../models/userModel";
import AppError from "../utils/AppError";
import Blog from "../models/blogModel";
import catchAsync from "../utils/catchAsync";
import User from "../models/userModel";

const seedBlogs = async (author: string, quantity: any = 20) => {
  const blogs: BlogInput[] = [];

  for (let index = 0; index < quantity; index++) {
    const blog = {
      title: faker.lorem.sentence(),
      content: `<p>${faker.lorem.paragraph()}</p>`,
      flair: flairEnums[Math.floor(Math.random() * flairEnums.length)],
      created_by: author,
      slug: faker.lorem.slug(),
      verified: true,
    };

    blogs.push(blog);
  }

  await Blog.deleteMany();
  await Blog.insertMany(blogs);
};

const seedUsers = async (excludeDelete: string, quantity: any = 20) => {
  const users: UserInput[] = [];

  for (let index = 0; index < quantity; index++) {
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
    const quantity = req.query.quantity;

    switch (req.params.model) {
      case "blog":
        await seedBlogs(req.user.id, quantity);
        break;

      case "user":
        await seedUsers(req.user.id, quantity);
        break;

      default:
        return next(new AppError("Invalid model", 404));
    }

    res.json({
      status: "success",
      message: `${req.params.model.toUpperCase()} model successfully seeded`,
    });
  }
);

export const seedDB = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await seedBlogs(req.user.id);
    await seedUsers(req.user.id);

    res.json({
      status: "success",
      message: "Database successfully seeded",
    });
  }
);
