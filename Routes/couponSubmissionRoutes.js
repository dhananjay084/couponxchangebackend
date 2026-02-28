import express from "express";
import {
  approveSubmission,
  createSubmission,
  getMySubmissions,
  getPendingSubmissions,
  rejectSubmission,
  updatePendingSubmission,
} from "../Controllers/couponSubmissionController.js";
import { protect, requireAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createSubmission);
router.get("/my", protect, getMySubmissions);
router.get("/pending", protect, requireAdmin, getPendingSubmissions);
router.put("/:id", protect, requireAdmin, updatePendingSubmission);
router.put("/:id/approve", protect, requireAdmin, approveSubmission);
router.put("/:id/reject", protect, requireAdmin, rejectSubmission);

export default router;
