const ExpenseModel = require("../models/ExpenseModel");
const multer = require("multer");
const cloudinaryUtil = require("../utils/CloudinaryUtil");
const { resolve } = require("path");
const { rejects } = require("assert");
const logActivity = require("../utils/logActivity");
const storage = multer.memoryStorage();
const upload = multer({ storage }).single("receipt");
const CategoryModel = require("../models/Category");

const createExpense = async (req, res) => {
  try {
    await new Promise((resolve, reject) => {
      upload(req, res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    const userId = req.user.id;
    const {
      title,
      amount,
      description,
      expenseDate,
      category,
      paymentThrough,
      vendor,
    } = req.body;

    if (!title || !amount || !expenseDate || !category || !paymentThrough) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let expenseData = {
      userId,
      title,
      amount: parseFloat(amount),
      description,
      expenseDate: new Date(expenseDate),
      category,
      paymentThrough,
    };

    // Safely assign vendor if it's a valid ObjectId
    if (vendor && vendor !== "null" && vendor !== "undefined") {
      expenseData.vendor = vendor;
    }
    if (req.file) {
      const cloudinaryResponse = await cloudinaryUtil.uploadFileToCloudinary(
        req.file.buffer,
        req.file.originalname
      );

      // console.log("Cloudinary Response:", cloudinaryResponse);

      if (cloudinaryResponse?.cloudinaryUrl) {
        expenseData.receipt = {
          cloudinaryUrl: cloudinaryResponse.cloudinaryUrl,
          originalName: cloudinaryResponse.originalName,
          uniqueName: cloudinaryResponse.uniqueName,
          fileType: cloudinaryResponse.fileType,
        };
      }
    }

    // ✅ Save Expense in Database
    const newExpense = new ExpenseModel(expenseData);
    await newExpense.save();

    const cat = await newExpense.populate("category");

    await logActivity(
      userId,
      "CREATE_EXPENSE",
      `Created an expense of ₹${amount} under '${cat.category.category_name}'`
    );

    res.status(201).json({
      message: "Expense added successfully",
      expense: newExpense,
    });
  } catch (error) {
    console.error("Error creating expense:", error);
    res.status(500).json({ error: error.message });
  }
};

const getExpensebyUserId = async (req, res) => {
  try {
    const userId = req.user.id;

    const expenses = await ExpenseModel.find({ userId })
      .sort({
        expenseDate: -1,
      })
      .populate("category")
      .populate("paymentThrough");

    res.status(200).json({ success: true, data: expenses });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

const getExpenseDetailbyId = async (req, res) => {
  try {
    const expense = await ExpenseModel.findById(req.params.id)
      .populate("category")
      .populate("paymentThrough");
    res.status(200).json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteExpensebyId = async (req, res) => {
  const { ids } = req.body;
  try {
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "No expense IDs provided" });
    }

    // Fetch the expenses and populate the category name
    const expensesToDelete = await ExpenseModel.find({
      _id: { $in: ids },
    }).populate("category");

    if (expensesToDelete.length === 0) {
      return res.status(404).json({ message: "No expenses found to delete" });
    }

    // Delete the expenses
    const result = await ExpenseModel.deleteMany({ _id: { $in: ids } });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "No expenses were deleted" });
    }

    for (let expense of expensesToDelete) {
      const categoryName =
        expense.category?.category_name || "Unknown Category";
      await logActivity(
        req.user.id,
        "DELETE_EXPENSE",
        `Deleted an expense of ₹${expense.amount} under '${categoryName}'`
      );
    }

    res.status(200).json({
      message: "Expenses deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error deleting expenses:", error);
    res.status(500).json({ message: error.message });
  }
};

const UpdateExpensebyId = async (req, res) => {
  try {
    // ✅ Ensure file upload completes before processing
    await new Promise((resolve, reject) => {
      upload(req, res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    const userId = req.user.id;
    const {
      title,
      amount,
      description,
      expenseDate,
      category,
      paymentThrough,
      vendor,
    } = req.body;
    const { id } = req.params; // ✅ Extract `id` from URL

    if (!id) {
      return res.status(400).json({ message: "Expense ID is required" });
    }

    let expense = await ExpenseModel.findById(id);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    expense.title = title || expense.title;
    expense.amount = amount ? parseFloat(amount) : expense.amount;
    expense.description = description || expense.description;
    expense.expenseDate = expenseDate
      ? new Date(expenseDate)
      : expense.expenseDate;
    expense.category = category || expense.category;
    expense.paymentThrough = paymentThrough || expense.paymentThrough;
    expense.vendor = vendor || expense.vendor;

    if (req.file) {
      // ✅ If updating receipt, delete old Cloudinary file first
      if (expense.receipt?.uniqueName) {
        await cloudinaryUtil.deleteFileFromCloudinary(
          expense.receipt.uniqueName
        );
      }

      // ✅ Upload new file to Cloudinary
      const cloudinaryResponse = await cloudinaryUtil.uploadFileToCloudinary(
        req.file.buffer,
        req.file.originalname
      );

      if (cloudinaryResponse?.cloudinaryUrl) {
        expense.receipt = {
          cloudinaryUrl: cloudinaryResponse.cloudinaryUrl,
          originalName: cloudinaryResponse.originalName,
          uniqueName: cloudinaryResponse.uniqueName,
          fileType: cloudinaryResponse.fileType,
        };
      }
    }

    await expense.save();

    const cat = await CategoryModel.findById(expense.category);
    await logActivity(
      userId,
      "UPDATE_EXPENSE",
      `Updated an expense of ₹${expense.amount} under '${
        cat?.category_name || "Unknown Category"
      }'`
    );

    // console.log("Updated Expense:", expense); // ✅ Log full updated data
    res.status(200).json({ message: "Expense updated successfully", expense });
  } catch (error) {
    console.error("Error updating expense:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createExpense,
  getExpensebyUserId,
  getExpenseDetailbyId,
  deleteExpensebyId,
  UpdateExpensebyId,
};
