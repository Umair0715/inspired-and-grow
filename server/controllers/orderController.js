const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { sendSuccessResponse } = require('../utils/helpers');
const handlerFactory = require('./factories/handlerFactory');
const Order = require('../models/orderModel');

const populateObj = [
    {
        path : 'orderItems',
        populate : {
            path : 'product' ,
            select : 'name images price stock unit description mainCategory subCategory',
            populate : {
                path : 'mainCategory' ,
                select : 'name'
            } , 
            populate : {
                path : 'subCategory' ,
                select : 'name'
            }
        }
    } ,
    {
        path : 'user' ,
        select : 'firstName lastName phone email location'
    }
]

exports.createOrder = catchAsync(async(req , res , next) => {
    const { orderItems , shippingInfo , totalPrice , shippingPrice } = req.body;
    if(!orderItems || !shippingInfo || !totalPrice) {
        return next(new AppError('Missing required credentials.' , 400))
    }
    const newOrder = await Order.create({
        orderItems ,
        shippingInfo ,
        totalPrice , 
        shippingPrice ,
        user : req.user._id 
    });
    sendSuccessResponse(res , 200 , {
        message : 'Order created successfully.' ,
        doc : newOrder 
    })
});

exports.getMyOrders = handlerFactory.getMy(Order , populateObj , 'orderStatus');
exports.getAllOrders = handlerFactory.getAll(Order , populateObj , 'orderStatus');
exports.getSingleOrder = handlerFactory.getOne(Order , populateObj);
exports.updateOrder = handlerFactory.updateOne(Order , populateObj);
exports.deleteOrder = handlerFactory.deleteOne(Order , populateObj);