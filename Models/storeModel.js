import mongoose from "mongoose";

const storeSchema = new mongoose.Schema(
  {
    storeLogo: {
      type: String,
      required: [true, "Store logo URL is required"],
    },
    storeName: {
      type: String,
      required: [true, "Store name is required"],
    },
    showOnHomePage: {
      type: String,
      enum: ["yes", "no"],
      default: "no",
    },
    popularStore: {
      type: String,
      enum: ["yes", "no"],
      default: "no",
    },
  },
  { timestamps: true }
);

const Store = mongoose.model("Store", storeSchema);
export default Store;
