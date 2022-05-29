import { Router } from "express";

import * as authController from "./../controllers/authController";
import * as blogController from "./../controllers/blogController";

const router = Router();

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
