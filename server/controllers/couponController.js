const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { sendSuccessResponse } = require('../utils/helpers');
const handlerFactory = require('./factories/handlerFactory');
const Coupon = require('../models/couponModel');
const couponValidation = require('../validations/couponValidation');
const Order = require('../models/orderModel');

exports.createCoupon = handlerFactory.createOne(Coupon , couponValidation);
exports.getAllCoupons = handlerFactory.getAll(Coupon);
exports.getSingleCoupon = handlerFactory.getOne(Coupon);
exports.updateCoupon = handlerFactory.updateOne(Coupon);
exports.deleteCoupon = handlerFactory.deleteOne(Coupon);

exports.applyCoupon = catchAsync(async(req , res , next) => {
    let { couponId , orderAmount } = req.body;
    orderAmount = Number(orderAmount);
    const coupon = await Coupon.findById(couponId);
    if(!coupon) {
        return next(new AppError('Coupon not found.' , 404))
    }
    if(!coupon.isActive) {
        return next(new AppError('Coupon is not active yet.' , 400))
    }
    if(new Date(coupon.startDate) > new Date()) {
        return next(new AppError('This Coupon is started yet.' , 400))
    }
    if(new Date(coupon.endDate) < new Date()) {
        return next(new AppError('This Coupon is expired.' , 400))
    }
    if(orderAmount < coupon.minOrder) {
        return next(new AppError(`Minimum order should be greater or equal to ${coupon.minOrder} amount to apply this coupon.` , 400))
    }
    if(coupon.couponType === 'firstOrder') {
        const order = await Order.findOne({ coupon : couponId });
        if(order) {
            return next(new AppError('You already used this voucher.' , 400))
        }
        const discountAmount = applyCouponOnAmount(coupon , orderAmount);
        return sendSuccessResponse(res , 200 , {
            message : 'Coupon applied successfully.' ,
            discountAmount ,
        })
    }else {
        const discountAmount = applyCouponOnAmount(coupon , orderAmount);
        return sendSuccessResponse(res , 200 , {
            message : 'Coupon applied successfully.' ,
            discountAmount ,
        })
    }
});

function applyCouponOnAmount (coupon , orderAmount) {
    if(coupon.discountType === 'percentage'){
        orderAmount -= ((orderAmount / 100) * coupon.discount);
        return orderAmount;
    }else if(coupon.discountType === 'amount') {
        return orderAmount - coupon.discount
    }
}
