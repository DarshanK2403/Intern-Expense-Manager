const Income = require("../models/IncomeModel");
const multer = require("multer");
const cloudinaryUtil = require("../utils/CloudinaryUtil");
const { resolve } = require("path");
const { rejects } = require("assert");

const storage = multer.memoryStorage();
const upload = multer({ storage }).single("receipt");

const AddIncome = async (req, res) => {
  try {
    await new Promise((resolve, reject) => {
      upload(req, res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    const userId = req.user.id;
    const { title, amount, incomeDate, category, paymentThrough, notes } =
      req.body;

    if (!title || !amount || !incomeDate || !category || !paymentThrough) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const IncomeData = {
      title,
      amount: parseFloat(amount),
      incomeDate: new Date(incomeDate),
      category,
      paymentThrough,
      notes,
      userId,
    };

    if (req.file) {
      const cloudinaryResponse = await cloudinaryUtil.uploadFileToCloudinary(
        req.file.buffer,
        req.file.originalname
      );

      console.log("Cloudinary Response:", cloudinaryResponse);

      if (cloudinaryResponse?.cloudinaryUrl) {
        IncomeData.receipt = {
          cloudinaryUrl: cloudinaryResponse.cloudinaryUrl,
          originalName: cloudinaryResponse.originalName,
          uniqueName: cloudinaryResponse.uniqueName,
          fileType: cloudinaryResponse.fileType,
        };
      }
    }

    const newIncome = new Income(IncomeData);
    await newIncome.save();

    res.status(200).json(newIncome);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getIncomebyUserId = async (req, res) => {
  const userId = req.user.id;
  try {
    const getincome = await Income.find({ userId })
      .sort({ incomeDate: -1 })
      .populate("category");
    if (getincome.length > 0) {
      res.status(200).json(getincome);
    } else {
      res.status(200).json("No Income Yet");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getIncomebyId = async (req, res) => {
  const { id } = req.params;
  try {
    const getIncome = await Income.findById(id);
    if (getIncome) {
      res.status(200).json(getIncome);
    } else {
      res.status(200).json("Invalid ID");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const EditIncomebyId = async (req, res) => {
  try {
    await new Promise((resolve, reject) => {
      upload(req, res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    const { id } = req.params;
    const { title, amount, incomeDate, category, paymentThrough, notes } = req.body;

    let income = await Income.findById(id);
    if (!income) {
      return res.status(404).json({ message: "Income not found" });
    }

    income.title = title || income.title;
    income.amount = amount ? parseFloat(amount) : income.amount;
    income.incomeDate = incomeDate ? new Date(incomeDate) : income.incomeDate;
    income.category = category || income.category;
    income.paymentThrough = paymentThrough || income.paymentThrough;
    income.notes = notes || income.notes;

    if (req.file) {
      if (income.receipt?.uniqueName) {
        await cloudinaryUtil.deleteFileFromCloudinary(
          income.receipt.uniqueName
        );
      }

      const cloudinaryResponse = await cloudinaryUtil.uploadFileToCloudinary(
        req.file.buffer,
        req.file.originalname
      );

      if (cloudinaryResponse?.cloudinaryUrl) {
        income.receipt = {
          cloudinaryUrl: cloudinaryResponse.cloudinaryUrl,
          originalName: cloudinaryResponse.originalName,
          uniqueName: cloudinaryResponse.uniqueName,
          fileType: cloudinaryResponse.fileType,
        };
      }
    }

    await income.save();
    res.status(200).json({ message: "Income updated successfully", income });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error);
  }
};

const deleteIncomebyId = async (req, res) => {
  try {
    const deleteIncome = await Income.findByIdAndDelete(req.params.id);
    if (deleteIncome) {
      res.status(200).json({ message: "Income Deleted" });
    } else {
      res.status(200).json({ message: "Somthing Wrong" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  AddIncome,
  getIncomebyUserId,
  getIncomebyId,
  EditIncomebyId,
  deleteIncomebyId,
};
