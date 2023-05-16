const mongoose = require('mongoose');


const inventorySchema = new mongoose.Schema({
    name : {
        type : String ,
        required : [true , 'Name is required.']
    } ,
    keywords : {
        type : Array ,
        default : [] 
    } ,
    stock : {
        type : Number ,
        required : [true , 'stock is required.']
    } ,
    unit : {
        type : String ,
        required : [true , 'Unit is required.']
    } ,
    price : {
        type : Number ,
        required : [true , 'Price is required.']
    } ,
    mainCategory : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'Category' ,
        required : [true , 'Main category is required.']
    } ,
    subCategory : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'SubCategory' ,
        required : [true , 'Sub category is required.']
    } ,
    images : {
        type : Array ,
        default : []
    } , 
    isActive : {
        type : Boolean , 
        default : true 
    } , 
    description : {
        type : String , 
        default : null 
    }
});

const Inventory = mongoose.model('Inventory' , inventorySchema);
module.exports = Inventory;