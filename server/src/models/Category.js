const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CategorySchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      required: true,
    },
    category_name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    category_description: {
      type: String,
    },
    category_type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
    },
  },
  {
    timestamps: {
      required: true,
    },
  }
);

const Category = mongoose.model("Category", CategorySchema);

module.exports = Category;
