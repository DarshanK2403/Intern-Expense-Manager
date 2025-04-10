const CategoryModel = require("../models/Category");

// Generic Create Category
const CreateCategory = async (req, res) => {
  try {
    const userId = req.user.id;
    // const { type } = req.query;
    const { category_name, category_description, category_type } = req.body;

    const existCategory = await CategoryModel.findOne({
      userId,
      category_type,
      category_name,
      category_description,
    });


    if (existCategory) {
      return res.status(409).json({ message: "Already exists" });
    }

    const newCategory = await CategoryModel.create({
      ...req.body,
      category_type,
      userId,
    });

    res.status(201).json({ message: "Created", data: newCategory });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Generic Get Category
const GetCategory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { type } = req.query; // Pass category_type like ?type=income

    const categories = await CategoryModel.find({
      userId,
      category_type: type,
    });

    if (!categories.length) {
      return res.status(200).json({ message: "No categories found", data: [] });
    }

    res.status(200).json({ message: "Success", data: categories });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Generic Delete Category
const DeleteCategory = async (req, res) => {
  try {
    const deleted = await CategoryModel.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({ message: "Deleted", data: deleted });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  CreateCategory,
  GetCategory,
  DeleteCategory,
};
