const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema({
    name : {
        type : String ,
        required : true 
    } ,
    image : {
        type : String ,
        default : null 
    } ,
    mainCategory : {
        type : mongoose.Schema.ObjectId ,
        ref : 'Category' ,
        required : true 
    } , 
    isActive : {
        type : Boolean , 
        default : true
    }
} , { timestamps : true });

subCategorySchema.pre(/^find/ , function(next) {
    this.populate('mainCategory' , 'name');
    next();
})

const SubCategory = mongoose.model('SubCategory', subCategorySchema);
module.exports = SubCategory;