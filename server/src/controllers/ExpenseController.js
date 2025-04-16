const ExpenseModel = require("../models/ExpenseModel");
const multer = require("multer");
const cloudinaryUtil = require("../utils/CloudinaryUtil");
const { resolve } = require("path");
const { rejects } = require("assert");

const storage = multer.memoryStorage();
const upload = multer({ storage }).single("receipt");

const createExpense = async (req, res) => {
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

    if (
      !title ||
      !amount ||
      !expenseDate ||
      !category ||
      !paymentThrough
    ) {
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
      vendor,
    };

    if (req.file) {
      // ✅ Upload file to Cloudinary with correct parameters
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

    // console.log("Saved Expense:", newExpense); // ✅ Full console log of saved expense
    res.status(201).json({
      message: "Expense added successfully",
      expense: newExpense,
    });
  } catch (error) {
    console.error("Error creating expense:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get Expenses by User ID
const getExpensebyUserId = async (req, res) => {
  try {
    const userId = req.user.id;

    const expenses = await ExpenseModel.find({ userId }).sort({
      expenseDate: -1,
    });

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
    const expense = await ExpenseModel.findById(req.params.id);
    res.status(200).json({
      title: expense.title,
      description: expense.description,
      amount: expense.amount,
      expenseDate: expense.expenseDate,
      category: expense.category,
      paymentThrough: expense.paymentThrough,
      vendor: expense.vendor,
      createdAt: expense.createdAt,
      updatedAt: expense.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteExpensebyId = async (req, res) => {
  // const userId = req.user.id
  const expenseId = req.params.id;
  try {
    const deleteExpense = await ExpenseModel.findByIdAndDelete(expenseId);
    if (deleteExpense) {
      res.status(200).json({ message: "Expense Deleted" });
    } else {
      res.status(200).json({ message: "Somthing Wrong" });
    }
  } catch (error) {
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

    const { title, amount, description, expenseDate, category, paymentThrough, vendor } = req.body;
    const { id } = req.params; // ✅ Extract `id` from URL

    if (!id) {
      return res.status(400).json({ message: "Expense ID is required" });
    }

    let expense = await ExpenseModel.findById(id);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // ✅ Update expense data
    expense.title = title || expense.title;
    expense.amount = amount ? parseFloat(amount) : expense.amount;
    expense.description = description || expense.description;
    expense.expenseDate = expenseDate ? new Date(expenseDate) : expense.expenseDate;
    expense.category = category || expense.category;
    expense.paymentThrough = paymentThrough || expense.paymentThrough;
    expense.vendor = vendor || expense.vendor;

    if (req.file) {
      // ✅ If updating receipt, delete old Cloudinary file first
      if (expense.receipt?.uniqueName) {
        await cloudinaryUtil.deleteFileFromCloudinary(expense.receipt.uniqueName);
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

    // console.log("Updated Expense:", expense); // ✅ Log full updated data
    res.status(200).json({ message: "Expense updated successfully", expense });
  } catch (error) {
    console.error("Error updating expense:", error);
    res.status(500).json({ error: error.message });
  }
};

const FakeExpense = async(req, res) =>{
  try {
    const { userId, count = 20, month, year } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const fakeIncomes = generateFakeExpenses(userId, count, { month, year });

    await Expense.insertMany(fakeIncomes);

    res.status(201).json({
      message: `${count} fake Expense generated successfully`,
      data: fakeIncomes,
    });
  } catch (err) {
    console.error("Error generating expenses:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  createExpense,
  getExpensebyUserId,
  getExpenseDetailbyId,
  deleteExpensebyId,
  UpdateExpensebyId,
  FakeExpense,
};
