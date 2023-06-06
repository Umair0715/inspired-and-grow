const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    name : {
        type : String ,
        required : [true , 'Coupon name is required.']
    } ,
    couponType : {
        type : String ,
        enum : ['firstOrder' , 'default'] ,
        required : [true , 'Coupon type is required.']
    } ,
    discountType : {
        type : String ,
        enum : ['amount' , 'percentage'] ,
        required : [true , 'Discount type is required.']
    } ,
    discount : {
        type : Number , 
        required : [true , 'Discount is required.']
    } ,
    minOrder : {
        type : Number ,
        required : [true , 'Min order amount is required.']
    } ,
    isActive : {
        type : Boolean ,
        default : true 
    } ,
    startDate : {
        type : Date ,
        required : [true , 'Start Date is required.']
    } ,
    endDate : {
        type : Date , 
        required : [true , 'End date is required.   ']
    }
} , { timestamps : true });


const Coupon = mongoose.model('Coupon', couponSchema);
module.exports = Coupon;