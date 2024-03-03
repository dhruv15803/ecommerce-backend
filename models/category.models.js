import mongoose from 'mongoose'

const subCategorySchema = new mongoose.Schema({
    name: {
        type:String,
        unique:true,
    }
},{timestamps:true})

const categorySchema = new mongoose.Schema({
    categoryName: {
        type:String,
        required:true,
        unique:true,
    },
    subCategories: [subCategorySchema]
},{timestamps:true});

export const SubCategory = mongoose.model('SubCategory',subCategorySchema);
export const Category = mongoose.model('Category',categorySchema);

