import User from "../Models/userModel.js";
import { createPasswordHash, generateAuthToken, hashPassword } from "../utils/auth.js";


const sanitizeUser = (user) => ({
  id: user._id,
  fullName: user.fullName,
  phone: user.phone,
  email: user.email,
  role: user.role,
});

export const signup = async (req, res) => {
  try {
    const { fullName, phone, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Full name, email, and password are required",
      });
    }

    if (String(password).length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    const { passwordSalt, passwordHash } = createPasswordHash(password);

    const user = await User.create({
      fullName: String(fullName).trim(),
      phone: phone ? String(phone).trim() : "",
      email: normalizedEmail,
      passwordSalt,
      passwordHash,
    });

    const token = generateAuthToken(user);

    return res.status(201).json({
      success: true,
      message: "Signup successful",
      data: sanitizeUser(user),
      token,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const inputHash = hashPassword(password, user.passwordSalt);
    if (inputHash !== user.passwordHash) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    user.lastLoginAt = new Date();
    await user.save();

    const token = generateAuthToken(user);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: sanitizeUser(user),
      token,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

export const logout = async (_req, res) => {
  return res.status(200).json({
    success: true,
    message: "Logout successful",
  });
};

export const getMyProfile = async (req, res) => {
  return res.status(200).json({
    success: true,
    data: sanitizeUser(req.user),
  });
};

export const updateMyProfile = async (req, res) => {
  try {
    const { fullName, phone, password, email } = req.body;

    if (email && String(email).trim().toLowerCase() !== String(req.user.email).toLowerCase()) {
      return res.status(400).json({
        success: false,
        message: "Email cannot be changed",
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (typeof fullName === "string" && fullName.trim()) {
      user.fullName = fullName.trim();
    }
    if (typeof phone === "string") {
      user.phone = phone.trim();
    }
    if (typeof password === "string" && password.length > 0) {
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 6 characters",
        });
      }
      const { passwordSalt, passwordHash } = createPasswordHash(password);
      user.passwordSalt = passwordSalt;
      user.passwordHash = passwordHash;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: sanitizeUser(user),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};
