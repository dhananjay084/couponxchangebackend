import HomepageConfig from "../Models/homepageConfigModel.js";

const sanitizeFaqItems = (items = []) =>
  items
    .map((item) => ({
      question: String(item?.question || "").trim(),
      answer: String(item?.answer || "").trim(),
    }))
    .filter((item) => item.question || item.answer);

const sanitizePayload = (body = {}) => {
  const sliderDealIds = Array.isArray(body.sliderDealIds)
    ? body.sliderDealIds.filter(Boolean)
    : [];

  const sections = body.sections || {};
  const sectionValue = (value = {}) => ({
    title: String(value.title || "").trim(),
    description: String(value.description || "").trim(),
  });

  return {
    sliderDealIds,
    sections: {
      section1: sectionValue(sections.section1),
      section2: sectionValue(sections.section2),
      section3: sectionValue(sections.section3),
      section4: sectionValue(sections.section4),
      popularStores: sectionValue(sections.popularStores),
    },
    midBanner: {
      imageUrl: String(body?.midBanner?.imageUrl || "").trim(),
      redirectUrl: String(body?.midBanner?.redirectUrl || "").trim(),
    },
    categoryPageBanner: {
      imageUrl: String(body?.categoryPageBanner?.imageUrl || "").trim(),
      redirectUrl: String(body?.categoryPageBanner?.redirectUrl || "").trim(),
    },
    faqSection: {
      title: String(body?.faqSection?.title || "FAQs").trim(),
      items: sanitizeFaqItems(body?.faqSection?.items || []),
    },
  };
};

export const getHomepageConfig = async (_req, res) => {
  try {
    const config = await HomepageConfig.findOne().sort({ createdAt: -1 });
    if (!config) {
      return res.json({
        success: true,
        data: null,
      });
    }

    return res.json({
      success: true,
      data: config,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const upsertHomepageConfig = async (req, res) => {
  try {
    const payload = sanitizePayload(req.body);
    const currentConfig = await HomepageConfig.findOne().sort({ createdAt: -1 });

    const updatedConfig = currentConfig
      ? await HomepageConfig.findByIdAndUpdate(currentConfig._id, payload, {
          new: true,
          runValidators: true,
        })
      : await HomepageConfig.create(payload);

    return res.json({
      success: true,
      message: "Homepage config saved successfully",
      data: updatedConfig,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
