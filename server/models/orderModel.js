const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.ObjectId,
        ref : "User" ,
        required : [true , 'user is required.'] 
    } ,
    orderItems : [
        {
            product : {
                type : mongoose.Schema.ObjectId,
                ref : "Inventory" ,
                required : [true , 'product is required.']
            },
            qty : {
                type : Number ,
                required : [true , 'Product quantity is required.']
            }
        }
    ],
    shippingInfo : {
        address : {
            type: String , 
            required : true 
        },
        phone : {
            type: Number , 
            required : true 
        },
    } ,
    totalPrice : {
        type: Number , 
        default : 0
    },
    orderStatus : {
        type : String ,
        enum : ['pending' , 'processing' , 'delivered' , 'returned' , 'cancelled'] ,
        default : 'pending'
    } ,
    paymentStatus : {
        type : String ,
        default : 'pending'
    } ,
    shippingPrice : {
        type : Number , 
        default : 90
    } ,
    coupon : { // agr kisi order p coupon apply hota h tw us order k sath coupon bhejna compulsory h
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'Coupon' ,
        default : null 
    }
   
} , { timestamps : true });



const Order = mongoose.model("Order" , orderSchema);
module.exports = Order ;