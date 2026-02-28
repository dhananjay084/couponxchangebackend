import mongoose from "mongoose";

const couponSubmissionSchema = new mongoose.Schema(
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
    dealSection: {
      type: String,
      enum: ["1st Section", "2nd Section", "3rd Section", "4th Section", "None"],
      default: "None",
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reviewedAt: {
      type: Date,
    },
    dealId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Deal",
    },
  },
  { timestamps: true }
);

const CouponSubmission = mongoose.model("CouponSubmission", couponSubmissionSchema);

export default CouponSubmission;
