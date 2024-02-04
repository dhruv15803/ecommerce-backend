import { Category } from "../models/category.models.js";

const addCategory = async (req, res) => {
  try {
    const { categoryName } = req.body;
    const category = await Category.create({
      categoryName: categoryName.toLowerCase(),
    });
    res.status(201).json({
      success: true,
      category,
    });
  } catch (error) {
    console.log(error);
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { categoryName } = req.body;
    await Category.deleteOne({ categoryName: categoryName.toLowerCase() });
    res.json({
      success: true,
      message: "successfully deleted category",
    });
  } catch (error) {
    console.log(error);
  }
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json({
      success: true,
      categories,
    });
  } catch (error) {
    console.log(error);
  }
};

const deleteAllCategories = async (req, res) => {
  try {
    await Category.deleteMany({});
    res.json({
      success: true,
      message: "deleted all categories",
    });
  } catch (error) {
    console.log(error);
  }
};

export { addCategory, getAllCategories, deleteCategory, deleteAllCategories };
