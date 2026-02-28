import User from "../Models/userModel.js";
import { verifyAuthToken } from "../utils/auth.js";

const getBearerToken = (authHeader = "") => {
  if (!authHeader.startsWith("Bearer ")) return null;
  return authHeader.slice(7).trim();
};

export const protect = async (req, res, next) => {
  try {
    const token = getBearerToken(req.headers.authorization || "");
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const payload = verifyAuthToken(token);
    const user = await User.findById(payload.sub).select("-passwordHash -passwordSalt");
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid user" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Admin access required" });
  }
  next();
};
