import express from "express";
import {
  createDeal,
  getDeals,
  getDealById,
  updateDeal,
  deleteDeal,
} from "../Controllers/dealController.js";
import { protect, requireAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getDeals);
router.get("/:id", getDealById);
router.post("/", protect, requireAdmin, createDeal);
router.put("/:id", protect, requireAdmin, updateDeal);
router.delete("/:id", protect, requireAdmin, deleteDeal);

export default router;
