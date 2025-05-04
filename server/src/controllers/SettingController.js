const CategoryModel = require("../models/Category");

// Generic Create Category
const CreateCategory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { type } = req.query;
    const { category_name, category_description } = req.body;
    console.log(type)
    const existCategory = await CategoryModel.findOne({
      userId,
      category_type: type,
      category_name,
      category_description,
    });


    if (existCategory) {
      return res.status(409).json({ message: "Already exists" });
    }
    // Create new category
    const newCategory = await CategoryModel.create({
      category_name,
      category_description,
      category_type : type,
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

const GetCategoryById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const category = await CategoryModel.findOne({
      _id: id,
      userId,
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Success", data: category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const UpdateCategory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { category_name, category_description, category_type } = req.body;

    // Check if the category exists
    const existing = await CategoryModel.findOne({ _id: id, userId });

    if (!existing) {
      return res.status(404).json({ message: "Category not found" });
    }

    // for duplicate
    const duplicate = await CategoryModel.findOne({
      _id: { $ne: id },
      userId,
      category_type,
      category_name,
      category_description,
    });

    if (duplicate) {
      return res.status(409).json({ message: "Category already exists" });
    }

    // Update
    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      id,
      {
        category_name,
        category_description,
        category_type,
      },
      { new: true }
    );

    res.status(200).json({ message: "Updated", data: updatedCategory });
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
  GetCategoryById,
  UpdateCategory,
  DeleteCategory,
};
