import { Request, Response, NextFunction } from "express";

import * as factory from "./factoryHandler";
import Comment from "../models/commentModel";

export const setBlogCommentParams = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.body.blog) req.body.blog = req.params.blogId;

  next();
};

// factory methods
export const getAllComments = factory.getAll(Comment);

export const getComment = factory.getOne(Comment);

export const createComment = factory.createOne(Comment);

export const updateComment = factory.updateOne(Comment);

export const deleteComment = factory.deleteOne(Comment);
