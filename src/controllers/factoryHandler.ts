import { Request, Response, NextFunction } from "express";

import AppError from "../utils/AppError";
import APIParams from "../utils/apiParams";
import catchAsync from "../utils/catchAsync";

const NO_DOC_FOUND: string = "Couldn't find document with that ID";

export const getAll = (Model: any) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let filter = {};

    // User's collection: filter the logged in user
    // if (Model.collection.collectionName === "users") {
    //   filter = { _id: { $ne: req.user.id } };
    // }

    const params = new APIParams(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // const docs = await params.query.explain(); // Explains query execution
    const docs = await params.query;

    const total_items = await Model.count();
    const per_page: any = req.query.limit || 100;
    const current_page: any = req.query.page || 1;
    const next_page = total_items / per_page > current_page;

    res.status(200).json({
      status: "success",
      data: docs,
      current_page,
      total_items,
      per_page,
      next_page,
    });
  });

export const getOne = (Model: any, populateOptions: any = null) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let query = Model.findById(req.params.id);
    if (populateOptions) query = query.populate(populateOptions);
    const doc = await query;

    if (!doc) return next(new AppError(NO_DOC_FOUND, 404));

    res.status(200).json({
      status: "success",
      data: doc,
    });
  });

export const createOne = (Model: any) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // Created by reference
    if (Model.collection.collectionName !== "users") {
      req.body.created_by = req.user.id;
    }

    const doc = await Model.create(req.body);

    res.status(201).json({
      status: "success",
      data: doc,
    });
  });

export const updateOne = (Model: any) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) return next(new AppError(NO_DOC_FOUND, 404));

    res.status(200).json({
      status: "success",
      data: doc,
    });
  });

export const deleteOne = (Model: any) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) return next(new AppError(NO_DOC_FOUND, 404));

    res.status(204).json({
      status: "success",
      data: null,
    });
  });
