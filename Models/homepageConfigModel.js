import mongoose from "mongoose";

const faqItemSchema = new mongoose.Schema(
  {
    question: { type: String, trim: true, default: "" },
    answer: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const textBlockSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true, default: "" },
    description: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const homepageConfigSchema = new mongoose.Schema(
  {
    sliderDealIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Deal",
      },
    ],
    sections: {
      section1: { type: textBlockSchema, default: () => ({}) },
      section2: { type: textBlockSchema, default: () => ({}) },
      section3: { type: textBlockSchema, default: () => ({}) },
      section4: { type: textBlockSchema, default: () => ({}) },
      popularStores: { type: textBlockSchema, default: () => ({}) },
    },
    midBanner: {
      imageUrl: { type: String, trim: true, default: "" },
      redirectUrl: { type: String, trim: true, default: "" },
    },
    categoryPageBanner: {
      imageUrl: { type: String, trim: true, default: "" },
      redirectUrl: { type: String, trim: true, default: "" },
    },
    faqSection: {
      title: { type: String, trim: true, default: "FAQs" },
      items: { type: [faqItemSchema], default: [] },
    },
  },
  { timestamps: true }
);

const HomepageConfig = mongoose.model("HomepageConfig", homepageConfigSchema);

export default HomepageConfig;
