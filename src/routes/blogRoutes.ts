import { Router } from "express";

import * as authController from "./../controllers/authController";
import * as blogController from "./../controllers/blogController";

const router = Router();

// Allow only authenticated user's access
router.use(authController.protect);

router
  .route("/")
  .get(blogController.getAllBlogs)
  .post(blogController.createBlog);

router
  .route("/:id")
  .get(blogController.getBlog)
  .patch(blogController.updateBlog)
  .delete(blogController.deleteBlog);

export default router;
