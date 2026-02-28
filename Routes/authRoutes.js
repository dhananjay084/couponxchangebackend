import express from "express";
import {
  getMyProfile,
  login,
  logout,
  signup,
  updateMyProfile,
} from "../Controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", protect, logout);
router.get("/me", protect, getMyProfile);
router.put("/me", protect, updateMyProfile);

export default router;
