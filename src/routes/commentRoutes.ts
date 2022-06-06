import { Router } from "express";

import * as authController from "./../controllers/authController";
import * as commentController from "./../controllers/commentController";

const router = Router();

router
  .route("/")
  .get(commentController.getAllComments)
  .post(authController.protect, commentController.createComment);

router
  .route("/:id")
  .get(commentController.getComment)
  .patch(authController.protect, commentController.updateComment)
  .delete(authController.protect, commentController.deleteComment);

export default router;
