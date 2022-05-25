import * as factory from "./factoryHandler";
import Blog from "../models/blogModel";

export const getAllUsers = factory.getAll(Blog);

export const getBlog = factory.getOne(Blog);

export const createBlog = factory.createOne(Blog);

export const updateBlog = factory.updateOne(Blog);

export const deleteBlog = factory.deleteOne(Blog);
