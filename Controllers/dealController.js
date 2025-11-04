import Deal from "../Models/dealModel.js";

// Create
export const createDeal = async (req, res) => {
  try {
    const deal = await Deal.create(req.body);
    res.status(201).json(deal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Read all
export const getDeals = async (req, res) => {
  try {
    const deals = await Deal.find();
    res.json(deals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Read single
export const getDealById = async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id);
    if (!deal) return res.status(404).json({ message: "Deal not found" });
    res.json(deal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update
export const updateDeal = async (req, res) => {
  try {
    const deal = await Deal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!deal) return res.status(404).json({ message: "Deal not found" });
    res.json(deal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete
export const deleteDeal = async (req, res) => {
  try {
    const deal = await Deal.findByIdAndDelete(req.params.id);
    if (!deal) return res.status(404).json({ message: "Deal not found" });
    res.json({ message: "Deal deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
