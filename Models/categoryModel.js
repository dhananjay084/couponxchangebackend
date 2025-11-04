import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: true,
      trim: true,
    },
    categoryImage: {
      type: String,
      required: true,
    },
    showOnHomePage: {
      type: String,
      enum: ["Yes", "No"],
      default: "No",
    },
    popularCategory: {
      type: String,
      enum: ["Yes", "No"],
      default: "No",
    },
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);
export default Category;
