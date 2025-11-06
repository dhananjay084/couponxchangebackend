import xlsx from "xlsx";
import fs from "fs";
import Deal from "../Models/dealModel.js";

export const bulkUploadDeals = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Read uploaded Excel file
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (!sheetData.length) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: "Excel file is empty" });
    }

    // Map fields properly
    const formattedDeals = sheetData.map((row) => ({
      dealTitle: row.dealTitle || row.title,
      dealDescription: row.dealDescription || "",
      dealStore: row.dealStore || "",
      dealImage: row.dealImage || "",
      dealLogo: row.dealLogo || "",
      dealTag: row.dealTag || "",
      dealCategory: row.dealCategory || "",
      dealCode: row.dealCode || "",
      redirectLink: row.redirectLink || "",
      expirationDate: row.expirationDate ? new Date(row.expirationDate) : null,
      dealSection: row.dealSection || "1st Section",
    }));

    // Insert into DB
    const inserted = await Deal.insertMany(formattedDeals);

    fs.unlinkSync(req.file.path); // remove file after processing

    res.status(201).json({
      message: `${inserted.length} deals uploaded successfully`,
      data: inserted,
    });
  } catch (error) {
    console.error("Bulk upload error:", error);
    res.status(500).json({ message: "Error uploading Excel file", error });
  }
};
