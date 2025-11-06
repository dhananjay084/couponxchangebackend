import express from "express";
import { upload } from "../utils/upload.js";
import { bulkUploadDeals } from "../Controllers/uploadController.js";

const router = express.Router();

router.post("/bulk-upload", upload.single("file"), bulkUploadDeals);

export default router;
