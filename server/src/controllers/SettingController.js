const CategoryModel = require("../models/Category");

const CreateCategory = async (req, res) => {
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
      res.status(201).json(newCategory);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const GetCategory = async (req, res) => {
    const {userId} = req.params;
    try {
        const getExpense = await CategoryModel.find({userId: userId});
        if (getExpense) {
            res.status(200).json({message: 'success', data: getExpense})
        } else {
            res.json({data: 'Not have any Category'})
        }
    } catch (error) {
        res.status(500).json({message: error.message})
    }
};

const DeleteCategory = async(req, res) => {
    // const userId = req.params;
    // const categoryId = req.params;
    try {
        const deleteCategory = await CategoryModel.findByIdAndDelete(req.params.id)
        res.send(deleteCategory)
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}
module.exports = { CreateCategory, GetCategory, DeleteCategory};
