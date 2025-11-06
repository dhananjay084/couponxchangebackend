import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure "uploads" folder exists
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("✅ 'uploads' folder created automatically");
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // ✅ no error now
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = [".xls", ".xlsx", ".csv"];
  const ext = path.extname(file.originalname);
  if (!allowed.includes(ext)) {
    return cb(new Error("Only Excel or CSV files allowed"));
  }
  cb(null, true);
};

export const upload = multer({ storage, fileFilter });
