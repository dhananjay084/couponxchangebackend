import mongoose from "mongoose";

const dealSchema = new mongoose.Schema(
  {
    dealTitle: { type: String, required: true },
    dealDescription: { type: String },
    dealStore: { type: String, required: true },
    dealImage: { type: String },
    dealLogo: { type: String },
    dealTag: { type: String },
    dealCategory: { type: String },
    dealCode: { type: String },
    redirectLink: { type: String },
    expirationDate: { type: Date },
    // 👇 NEW FIELD
    dealSection: {
      type: String,
      enum: ["1st Section", "2nd Section", "3rd Section", "4th Section","None"],
      required: true,
    },
  },
  { timestamps: true }
);

const Deal = mongoose.model("Deal", dealSchema);
export default Deal;
