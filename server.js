import express, { json } from "express";
import { config } from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import dealRoutes from "./Routes/dealRoutes.js";
import storeRoutes from "./Routes/storeRoutes.js";
import categoryRoutes from "./Routes/categoryRoutes.js";
import uploadRoutes from "./Routes/uploadRoutes.js";

// import userRoutes from "./routes/userRoutes";

config();
connectDB();

const app = express();

app.use(cors());
app.use(json());

// Routes
// app.use("/api/users", userRoutes);
app.use("/api/deals", dealRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/upload", uploadRoutes); // ✅ new route


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
