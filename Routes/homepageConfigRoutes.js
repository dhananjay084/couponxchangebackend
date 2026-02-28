import express from "express";
import {
  getHomepageConfig,
  upsertHomepageConfig,
} from "../Controllers/homepageConfigController.js";
import { protect, requireAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getHomepageConfig);
router.put("/", protect, requireAdmin, upsertHomepageConfig);

export default router;
