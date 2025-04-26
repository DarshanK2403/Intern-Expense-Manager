const CategoryModel = require("../models/Category");
const mongoose = require("mongoose");

const createDefaultCategoriesForUser = async (userId) => {
  const defaultCategories = [
    {
      _id: new mongoose.Types.ObjectId(), // Generate a unique ID
      category_name: "Electronics",
      category_description: "Phones, Laptops, Gadgets, Accessories",
      category_type: "expense"
    },
    {
      _id: new mongoose.Types.ObjectId(),
      category_name: "Clothing & Fashion",
      category_description: "Men’s, Women’s, Kids’ Apparel",
      category_type: "expense"
    },
    {
      _id: new mongoose.Types.ObjectId(),
      category_name: "Home & Kitchen",
      category_description: "Furniture, Appliances, Decor",
      category_type: "expense"
    },
    {
      _id: new mongoose.Types.ObjectId(),
      category_name: "Books & Stationery",
      category_description: "Fiction, Non-Fiction, Office Supplies",
      category_type: "expense"
    },
    {
      _id: new mongoose.Types.ObjectId(),
      category_name: "Health & Beauty",
      category_description: "Skincare, Fitness, Personal Care",
      category_type: "expense"
    },

    // Income Category
    {
      _id: new mongoose.Types.ObjectId(),
      category_name: "Salary & Wages",
      category_description: "Regular income from a job, including salary and bonuses",
      category_type: "income"
    },
    {
      _id: new mongoose.Types.ObjectId(),
      category_name: "Freelance & Side Hustle",
      category_description: "Earnings from freelancing, gigs, or part-time work",
      category_type: "income"
    },
    {
      _id: new mongoose.Types.ObjectId(),
      category_name: "Investments & Dividends",
      category_description: "Profits from stocks, mutual funds, or dividend payouts",
      category_type: "income"
    },
    {
      _id: new mongoose.Types.ObjectId(),
      category_name: "Business Revenue",
      category_description: "Income from self-employment, businesses, or entrepreneurial ventures",
      category_type: "income"
    },
    {
      _id: new mongoose.Types.ObjectId(),
      category_name: "Gifts & Other Income",
      category_description: "Money received as gifts, lottery winnings, or unexpected earnings",
      category_type: "income"
    },
    {
      _id: new mongoose.Types.ObjectId(),
      category_name: "Online Retailers",
      category_description: "E-commerce platforms and online shopping stores",
      category_type: "vendor"
    },
    {
      _id: new mongoose.Types.ObjectId(),
      category_name: "Local Suppliers",
      category_description: "Nearby stores and physical suppliers for goods and services",
      category_type: "vendor"
    },
    {
      _id: new mongoose.Types.ObjectId(),
      category_name: "Service Providers",
      category_description: "Freelancers, agencies, and professionals offering services",
      category_type: "vendor"
    },
    {
      _id: new mongoose.Types.ObjectId(),
      category_name: "Wholesale Distributors",
      category_description: "Bulk product suppliers and manufacturers",
      category_type: "vendor"
    },
    {
      _id: new mongoose.Types.ObjectId(),
      category_name: "Utilities & Bills",
      category_description: "Electricity, internet, water, and other utility providers",
      category_type: "vendor"
    }

  ];

  const categoriesToInsert = defaultCategories.map((category) => ({
    ...category,
    userId,
  }));

  await CategoryModel.insertMany(categoriesToInsert);
};

module.exports = { createDefaultCategoriesForUser };
