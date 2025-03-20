const CategoryModel = require("../models/Category");
const mongoose = require("mongoose");

const createDefaultCategoriesForUser = async (userId) => {
  const defaultCategories = [
    {
      _id: new mongoose.Types.ObjectId(), // Generate a unique ID
      category_name: "Electronics",
      category_description: "Phones, Laptops, Gadgets, Accessories",
    },
    {
      _id: new mongoose.Types.ObjectId(),
      category_name: "Clothing & Fashion",
      category_description: "Men’s, Women’s, Kids’ Apparel",
    },
    {
      _id: new mongoose.Types.ObjectId(),
      category_name: "Home & Kitchen",
      category_description: "Furniture, Appliances, Decor",
    },
    {
      _id: new mongoose.Types.ObjectId(),
      category_name: "Books & Stationery",
      category_description: "Fiction, Non-Fiction, Office Supplies",
    },
    {
      _id: new mongoose.Types.ObjectId(),
      category_name: "Health & Beauty",
      category_description: "Skincare, Fitness, Personal Care",
    },
  ];

  const categoriesToInsert = defaultCategories.map((category) => ({
    ...category,
    userId,
  }));

  await CategoryModel.insertMany(categoriesToInsert);
  console.log(`✅ Default categories created for user: ${userId}`);
};

module.exports = { createDefaultCategoriesForUser };
