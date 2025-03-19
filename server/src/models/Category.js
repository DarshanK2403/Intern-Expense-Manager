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
      Unique: true,
    },
    category_description: {
      type: String,
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
