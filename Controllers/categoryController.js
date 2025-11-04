import Category from "../Models/categoryModel.js";

// ✅ Create Category
export const createCategory = async (req, res) => {
  try {
    const { categoryName, categoryImage, showOnHomePage, popularCategory } = req.body;
    const category = await Category.create({
      categoryName,
      categoryImage,
      showOnHomePage,
      popularCategory,
    });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get All Categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update Category
export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete Category
export const deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
