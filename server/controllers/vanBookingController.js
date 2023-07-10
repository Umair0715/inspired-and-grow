const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { sendSuccessResponse } = require('../utils/helpers');
const handlerFactory = require('./factories/handlerFactory');
const VanBooking = require('../models/vanBookingModel');
const Driver = require('../models/driverModel');
const vanBookingValidation = require('../validations/vanBookingValidation');
const moment = require('moment');

const populateObj = [
    {
        path : 'user' ,
        select : 'firstName lastName email phone location image'
    } ,
    {
        path : 'driver' ,
        select : 'firstName lastName email phone location image'
    } ,
]

exports.createBooking = catchAsync(async(req , res , next) => {
    const { driverId , date } = req.body;
    const { error } = vanBookingValidation.validate(req.body);
    if(error) {
        return next(new AppError(error.details[0].message , 400))
    }
    const driver = await Driver.findById(driverId);
    if(!driver) {
        return next(new AppError('Invalid Driver Selected. Driver not found.' , 400))
    }
    const bookingExist = await VanBooking.findOne({ 
        user : req.user._id ,
        driver : driver._id ,
        $or : [
            { status : { $ne : 'completed' } } , 
            { status : { $ne : 'cancelled' } } , 
        ] ,
        date : new Date(req.body.date)
    });
    if(bookingExist) {
        return next(new AppError("You have already booked this van for selected date.", 400))
    }
    if(new Date(date) < moment().startOf('day') || new Date(date) > moment(new Date()).add(2 , 'days') ) {
        return next(new AppError('Selected date is invalid. You can create pre booking for 2 days only .' , 400))
    }
    const newBooking = await VanBooking.create({
        user : req.user._id ,
        driver : driver._id ,
        ...req.body ,
        username : req.user.firstName + ' ' + req.user.lastName 
    });
    sendSuccessResponse(res , 200 , {
        message : 'Van booked successfully.',
        doc : newBooking
    })
});

exports.getAllBookings = handlerFactory.getAll(VanBooking , populateObj);
exports.getMyBookings = handlerFactory.getMy(VanBooking , populateObj);
exports.getBookingDetails = handlerFactory.getOne(VanBooking , populateObj);
exports.deleteBooking = handlerFactory.deleteOne(VanBooking);
exports.updateBooking = handlerFactory.updateOne(VanBooking , '' , populateObj)