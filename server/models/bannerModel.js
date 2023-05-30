const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
    name : {
        type : String ,
        index : true ,
        required : [true , 'Banner name is required.']
    } ,
    description : {
        type : String ,
        required : [true , 'Banner description is required.']
    } ,
    type : {
        type : String ,
        enum : ['Category' , 'Inventory'] ,
        required : [true , 'Banner Type is required.']
    } ,
    bannerItem : {
        type : mongoose.Schema.ObjectId ,
        refPath : 'type' ,
        required : [true , 'Banner Item is required.']
    } ,
    startDate : {
        type : String ,
        required : [true , 'Start Date is required.']
    } ,
    endDate : {
        type : String ,
        required : [true , 'End Date is required.']
    } ,
    image : {
        type : String ,
        required : [true , 'Image is required.']
    } ,
    isActive : {
        type : Boolean ,
        default : true ,
    } ,
    offer : {
        type : String ,
        default : null 
    }

} , { timestamps : true });

const Banner = mongoose.model('Banner' , bannerSchema);
module.exports = Banner;