import { Router } from "express";

import * as authController from "./../controllers/authController";
import * as blogController from "./../controllers/blogController";
import commentRouter from "./commentRoutes";

const router = Router();

router.use("/:blogId/comments", commentRouter);

router.get("/featured", blogController.getFeaturedBlogs);

router
  .route("/")
  .get(blogController.getAllBlogs)
  .post(
    authController.protect,
    blogController.uploadCoverImage,
    blogController.resizeCoverImage,
    blogController.createBlog
  );

router.get("/user", authController.protect, blogController.getLoggedInUserBlog);

router
  .route("/:id")
  .get(blogController.getBlog)
  .patch(
    authController.protect,
    blogController.uploadCoverImage,
    blogController.resizeCoverImage,
    blogController.updateBlog
  )
  .delete(authController.protect, blogController.deleteBlog);

router.get("/slug/:slug", blogController.getBySlug);

export default router;
