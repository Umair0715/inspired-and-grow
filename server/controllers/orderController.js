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
    if(orderItems.length === 0) {
        return next(new AppError('Empty order. Please select at least one item.' , 400))
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
exports.updateOrder = handlerFactory.updateOne(Order , '' , populateObj);
exports.deleteOrder = handlerFactory.deleteOne(Order , populateObj);

exports.getOngoingOrders = catchAsync(async(req , res) => {
    const page = Number(req.query.page) || 1;
    const pageSize = 10;

    const query = {
        $or : [
            {
                orderStatus : 'pending'
            } ,
            {
                orderStatus : 'processing'
            }
        ] , 
        user : req.user._id 
    }
    const orders = await Order.find(query)
    .populate(populateObj)
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ createdAt : -1 })

    const docCount = await Order.countDocuments(query);
    const pages = Math.ceil(docCount/pageSize);
    sendSuccessResponse(res , 200 , {
        docs : orders , pages , page , docCount
    })
});

exports.getOrdersHistory = catchAsync(async(req , res) => {
    const page = Number(req.query.page) || 1;
    const pageSize = 10;

    const query = {
        $or : [
            {
                orderStatus : 'delivered' 
            } ,
            {
                orderStatus : 'cancelled' 
            } ,
            {
                orderStatus : 'returned' 
            }
        ] , 
        user : req.user._id 
    }
    const orders = await Order.find(query)
    .populate(populateObj)
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ createdAt : -1 })

    const docCount = await Order.countDocuments(query);
    const pages = Math.ceil(docCount/pageSize);
    sendSuccessResponse(res , 200 , {
        docs : orders , pages , page , docCount
    })
})