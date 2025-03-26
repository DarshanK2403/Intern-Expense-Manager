const CategoryModel = require("../models/Category");

const CreateExpenseCategory = async (req, res) => {
  try {
    const { userId } = req.params;
    // const { category_name, category_description } = req.body;
    const data = { ...req.body, userId };
    const category_name = req.body.category_name;
    const existCategory = await CategoryModel.findOne({
      category_name,
      userId,
    });
    if (existCategory) {
      res.send("alredy exist");
    } else {
      const newCategory = await CategoryModel.create(data);
      res.status(201).json({message: "Created", data: newCategory});
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const GetExpenseCategory = async (req, res) => {
    const {userId} = req.params;
    try {
        const getExpense = await CategoryModel.find({userId: userId, category_type: "expense"});
        if (getExpense) {
            res.status(200).json({message: 'success', data: getExpense})
        } else {
            res.json({data: 'Not have any Category'})
        }
    } catch (error) {
        res.status(500).json({message: error.message})
    }
};

const DeleteExpenseCategory = async(req, res) => {
    try {
        const deleteCategory = await CategoryModel.findByIdAndDelete(req.params.id)
        res.send(deleteCategory)
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const CreateIncomeCategory = async(req, res)=>{
  try {
    const { userId } = req.params;
    // const { category_name, category_description } = req.body;
    const data = { ...req.body, userId };
    const category_name = req.body.category_name;
    const existCategory = await CategoryModel.findOne({
      category_name,
      userId,
    });
    if (existCategory) {
      res.send("alredy exist");
    } else {
      const newCategory = await CategoryModel.create(data);
      res.status(201).json({message: "Created", data: newCategory});
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const GetIncomeategory = async(req, res) =>{
  const {userId} = req.params;
  try {
      const getExpense = await CategoryModel.find({userId: userId, category_type: "income"});
      if (getExpense) {
          res.status(200).json({message: 'success', data: getExpense})
      } else {
          res.json({data: 'Not have any Category'})
      }
  } catch (error) {
      res.status(500).json({message: error.message})
  }
}

const DeleteIncomeCategory = async(req, res) =>{
  try {
    const deleteCategory = await CategoryModel.findByIdAndDelete(req.params.id)
    res.send(deleteCategory)
} catch (error) {
    res.status(500).json({message: error.message});
}
}

module.exports = { CreateExpenseCategory, GetExpenseCategory, DeleteExpenseCategory, CreateIncomeCategory, GetIncomeategory, DeleteIncomeCategory};
