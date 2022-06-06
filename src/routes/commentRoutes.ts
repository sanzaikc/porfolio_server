import { Router } from "express";

import * as authController from "./../controllers/authController";
import * as commentController from "./../controllers/commentController";

const router = Router({ mergeParams: true });

// Allow only authenticated user's access
router.use(authController.protect);

router
  .route("/")
  .get(commentController.getAllComments)
  .post(
    commentController.setBlogCommentParams,
    commentController.createComment
  );

router
  .route("/:id")
  .get(commentController.getComment)
  .patch(commentController.updateComment)
  .delete(commentController.deleteComment);

export default router;
