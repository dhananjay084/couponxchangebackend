import Store from "../Models/storeModel.js";

// ✅ Create store
export const createStore = async (req, res) => {
  try {
    const store = await Store.create(req.body);
    return res.status(201).json(store);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// ✅ Get all stores
export const getStores = async (req, res) => {
  try {
    const stores = await Store.find().sort({ createdAt: -1 });
    return res.status(200).json(stores);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ✅ Update store
export const updateStore = async (req, res) => {
  try {
    const store = await Store.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!store) return res.status(404).json({ message: "Store not found" });
    return res.status(200).json(store);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// ✅ Delete store
export const deleteStore = async (req, res) => {
  try {
    const store = await Store.findByIdAndDelete(req.params.id);
    if (!store) return res.status(404).json({ message: "Store not found" });
    return res.status(200).json({ id: store._id, message: "Store deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// storeController.js - Add this function
export const getStoreById = async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);
    if (!store) return res.status(404).json({ message: "Store not found" });
    return res.status(200).json(store);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};