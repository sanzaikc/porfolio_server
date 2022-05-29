import express from "express";

import * as authController from "./../controllers/authController";
import * as seedController from "./../controllers/seedController";

const router = express.Router();

router.use(authController.protect, authController.restrictTo("admin"));

router.get("/:model", seedController.seedModel);

export default router;
