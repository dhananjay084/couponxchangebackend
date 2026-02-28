import User from "../Models/userModel.js";
import { createPasswordHash } from "./auth.js";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@couponxchange.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin@123";
const ADMIN_NAME = process.env.ADMIN_NAME || "CouponXchange Admin";

export const ensureAdminUser = async () => {
  const normalizedEmail = ADMIN_EMAIL.trim().toLowerCase();
  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) {
    if (existing.role !== "admin") {
      existing.role = "admin";
      await existing.save();
    }
    return;
  }

  const { passwordSalt, passwordHash } = createPasswordHash(ADMIN_PASSWORD);
  await User.create({
    fullName: ADMIN_NAME,
    phone: "",
    email: normalizedEmail,
    role: "admin",
    passwordSalt,
    passwordHash,
  });

  console.log(`Default admin created: ${normalizedEmail}`);
};
