import express from "express";
import {
  createDeal,
  getDeals,
  getDealById,
  updateDeal,
  deleteDeal,
} from "../Controllers/dealController.js";

const router = express.Router();

router.post("/", createDeal);
router.get("/", getDeals);
router.get("/:id", getDealById);
router.put("/:id", updateDeal);
router.delete("/:id", deleteDeal);

export default router;
