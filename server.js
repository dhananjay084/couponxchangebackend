import express, { json } from "express";
import { config } from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import dealRoutes from "./Routes/dealRoutes.js";
import storeRoutes from "./Routes/storeRoutes.js";
import categoryRoutes from "./Routes/categoryRoutes.js";
import uploadRoutes from "./Routes/uploadRoutes.js";
import blogRoutes from "./Routes/blogRoutes.js"; // ✅ Add blog routes
import { fileURLToPath } from 'url';
import path from 'path';

config();
connectDB();

const app = express();

// ES6 module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(json());
app.use(express.urlencoded({ extended: true })); // Add for form data

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use("/api/deals", dealRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/blogs", blogRoutes); // ✅ Add blog routes

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ 
    success: true, 
    message: "API is running", 
    services: ["deals", "stores", "categories", "upload", "blogs"] 
  });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({ success: false, error: "Route not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));