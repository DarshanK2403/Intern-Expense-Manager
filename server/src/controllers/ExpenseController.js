const ExpenseModel = require("../models/ExpenseModel");
const multer = require("multer");
const cloudinaryUtil = require("../utils/CloudinaryUtil");  

const storage = multer.memoryStorage({});
const upload = multer({ storage }).single("receipt");

// Create Expense with Optional File Upload
const createExpense = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    try {
      let expenseData = { ...req.body };

      if (req.file) {
        const cloudinaryResponse = await cloudinaryUtil.uploadFiletoCloudinary(
          req.file.buffer,
          req.file.originalname
        );
        expenseData.receipt = cloudinaryResponse.secure_url; // Save receipt URL
      }

      // ✅ Create new expense
      const newExpense = new ExpenseModel(expenseData);
      await newExpense.save();
      res.status(201).json({
        message: "Expense added successfully",
        expense: newExpense,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
};

// Get Expenses by User ID
const getExpensebyUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    const expenses = await ExpenseModel.find({ userId }).sort({ createdAt: -1 });

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
    const expenseDetail = await ExpenseModel.findById(req.params.id);
    res.status(200).json({ data: expenseDetail });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }   
};

const getLatestExpense = async (req, res) => {
  const limit = parseInt(req.query.limit) || 5;
  try {
    const {userId} = req.params;
    const latestExpense = await ExpenseModel.find({userId}).sort({ createdAt: -1}).limit(limit);
    res.status(200).json({data: latestExpense})
  } catch (error) {
    res.status(500).json({message: error.message})
  }
}

const deleteExpensebyId = async (req, res) =>{
  try {
    const deleteExpense = await ExpenseModel.findByIdAndDelete(req.params.id);
    if(deleteExpense){
      res.status(200).json({message: "Expense Deleted"})
    }
    else{
      res.status(200).json({message: "Somthing Wrong"})
    }
  } catch (error) {
    res.status(500).json({message: error.message})
  }
}

module.exports = {
  createExpense,
  getExpensebyUserId,
  getExpenseDetailbyId,
  deleteExpensebyId,
  getLatestExpense,
};
