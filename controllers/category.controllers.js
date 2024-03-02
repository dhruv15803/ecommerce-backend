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

const getCategory = async (req,res)=>{
try {
  const {categoryId} = req.body;
  const category = await Category.findOne({_id:categoryId});
  res.json({
    "success":true,
    category,
  })
} catch (error) {
  console.log(error);
}
}


const addSubCategory = async (req,res)=> {
try {
    const {subCategoryName,categoryName} = req.body;  
    const category = await Category.findOne({categoryName});
    if(!category){
      res.status(400).json({
        "success":false,
        "message":"category does not exist"
      })
    }
    console.log(subCategoryName);
    console.log(category.categoryName);
    await Category.updateOne(
      { categoryName: category.categoryName },
      { $push: {subCategories: {name:subCategoryName}}}
    );
    const updatedCategory = await Category.findOne({categoryName:category.categoryName});
    res.json({
      "success":true,
      "message":"sub category added",
      category:updatedCategory
    })
} catch (error) {
  console.log(error);
}
}


const getSubCategory = async (req,res)=>{
try {
    const {categoryName} = req.body;
    const category = await Category.findOne({categoryName});
    if(!category){
      res.status(400).json({
        "success":false,
        "message":"category not found"
      })
    }
    res.status(200).json({
      "success":true,
      category,
    })
} catch (error) {
  console.log(error);
}
}


const deleteSubCategory = async (req,res)=>{
try {
  const {categoryName,subCategoryName} = req.body;
  console.log(subCategoryName);
  const category = await Category.findOne({categoryName});
  if(!category){
    res.status(400).json({
      "success":false,
      "message":"category does not exist"
    })
  }
  const response = await Category.updateOne({categoryName:category.categoryName},{$pull:{subCategories: {name:subCategoryName}}});
  console.log(response);
  res.status(200).json({
    "success":true,
    "message":"successfully deleted subcategory0"
  })
} catch (error) {
  console.log(error);
}
}


const clearAllSubCategories =  async (req,res)=>{
try {
    const {categoryName} = req.body;
    const category = await Category.findOne({categoryName});
    if(!category){
      res.status(400).json({
        "success":false,
        "message":"category does not exist"
      })
    }
    await Category.updateOne({categoryName:category.categoryName},{$set:{subCategories:[]}})
    res.status(200).json({
      "success":true,
      "message":"successfully deleted all subCategories"
    })
} catch (error) {
  console.log(error);
}
}




export { addCategory, getAllCategories, deleteCategory, deleteAllCategories,getCategory,addSubCategory,getSubCategory,deleteSubCategory,clearAllSubCategories};
