import mongoose from 'mongoose'

const subCategorySchema = new mongoose.Schema({
    name: {
        type:String,
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

export const Category = mongoose.model('Category',categorySchema);

