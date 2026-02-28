import CouponSubmission from "../Models/couponSubmissionModel.js";
import Deal from "../Models/dealModel.js";

const editableFields = [
  "dealTitle",
  "dealDescription",
  "dealStore",
  "dealImage",
  "dealLogo",
  "dealTag",
  "dealCategory",
  "dealCode",
  "redirectLink",
  "expirationDate",
  "dealSection",
];

const pickEditableFields = (source) => {
  const payload = {};
  editableFields.forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(source, field)) {
      payload[field] = source[field];
    }
  });
  return payload;
};

const extractDealPayload = (source) => ({
  dealTitle: source.dealTitle,
  dealDescription: source.dealDescription,
  dealStore: source.dealStore,
  dealImage: source.dealImage,
  dealLogo: source.dealLogo,
  dealTag: source.dealTag,
  dealCategory: source.dealCategory,
  dealCode: source.dealCode,
  redirectLink: source.redirectLink,
  expirationDate: source.expirationDate,
  dealSection: source.dealSection || "None",
});

export const createSubmission = async (req, res) => {
  try {
    // Public users cannot choose section; admin sets it during review.
    const input = pickEditableFields(req.body);
    input.dealSection = "None";

    const submission = await CouponSubmission.create({
      ...extractDealPayload(input),
      submittedBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Coupon submitted for admin approval",
      data: submission,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getPendingSubmissions = async (_req, res) => {
  try {
    const submissions = await CouponSubmission.find({ status: "pending" })
      .populate("submittedBy", "fullName email")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: submissions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMySubmissions = async (req, res) => {
  try {
    const submissions = await CouponSubmission.find({ submittedBy: req.user._id })
      .sort({ createdAt: -1 });
    return res.json({
      success: true,
      data: submissions,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePendingSubmission = async (req, res) => {
  try {
    const submission = await CouponSubmission.findById(req.params.id);
    if (!submission) {
      return res.status(404).json({ success: false, message: "Submission not found" });
    }

    if (submission.status !== "pending") {
      return res.status(400).json({ success: false, message: "Only pending submissions can be edited" });
    }

    const updates = pickEditableFields(req.body);
    Object.assign(submission, updates);
    await submission.save();

    return res.json({
      success: true,
      message: "Submission updated",
      data: submission,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const approveSubmission = async (req, res) => {
  try {
    const submission = await CouponSubmission.findById(req.params.id);
    if (!submission) {
      return res.status(404).json({ success: false, message: "Submission not found" });
    }

    if (submission.status !== "pending") {
      return res.status(400).json({ success: false, message: "Submission already reviewed" });
    }

    // Allow admin to provide final edits while approving.
    const updates = pickEditableFields(req.body);
    Object.assign(submission, updates);
    await submission.save();

    const deal = await Deal.create(extractDealPayload(submission));

    submission.status = "approved";
    submission.reviewedBy = req.user._id;
    submission.reviewedAt = new Date();
    submission.dealId = deal._id;
    await submission.save();

    return res.json({
      success: true,
      message: "Submission approved and added to deals",
      data: { submission, deal },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const rejectSubmission = async (req, res) => {
  try {
    const submission = await CouponSubmission.findById(req.params.id);
    if (!submission) {
      return res.status(404).json({ success: false, message: "Submission not found" });
    }

    if (submission.status !== "pending") {
      return res.status(400).json({ success: false, message: "Submission already reviewed" });
    }

    submission.status = "rejected";
    submission.reviewedBy = req.user._id;
    submission.reviewedAt = new Date();
    await submission.save();

    return res.json({
      success: true,
      message: "Submission rejected",
      data: submission,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
