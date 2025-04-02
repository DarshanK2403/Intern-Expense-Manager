const Income = require("../models/IncomeModel");

const AddIncome = async (req, res) => {
  try {
    const { userId } = req.params;
    const { title, amount, incomeDate, category, notes, receipt } = req.body;
    let errors = {};
    if (!title) errors.title = { param: "title", message: "Title is required" };
    if (!amount)
      errors.amount = { param: "amount", message: "Amount is required" };
    if (!incomeDate)
      errors.incomeDate = {
        param: "incomeDate",
        message: "Income Date is required",
      };
    if (!category)
      errors.category = { param: "category", message: "Select Category" };
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }
    const data = {
      title,
      amount,
      incomeDate,
      category,
      notes,
      receipt,
      userId,
    };
    const IncomeResponse = await Income.create(data);
    res.status(200).json(IncomeResponse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getIncomebyUserId = async(req, res) =>{
  const {userId} = req.params;
  try {
    const getincome = await Income.find({userId}).sort({incomeDate: -1});
    if(getincome.length > 0){
      res.status(200).json(getincome);
    }
  } catch (error) {
    res.status(500).json({message: error.message})
  }
}

const deleteIncomebyId = async (req, res) =>{
  try {
    const deleteIncome = await Income.findByIdAndDelete(req.params.id);
    if(deleteIncome){
      res.status(200).json({message: "Income Deleted"})
    }
    else{
      res.status(200).json({message: "Somthing Wrong"})
    }
  } catch (error) {
    res.status(500).json({message: error.message})
  }
}

module.exports = {
  AddIncome,
  getIncomebyUserId,
  deleteIncomebyId,
};
