const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { sendSuccessResponse } = require('../utils/helpers');
const handlerFactory = require('./factories/handlerFactory');
const VanBooking = require('../models/vanBookingModel');
const Driver = require('../models/driverModel');

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
    const { driverId , customerLocation } = req.body;
    if(!driverId || !customerLocation) {
        return next(new AppError('Driver id and customer location is required.' , 400))
    }
    const driver = await Driver.findById(driverId);
    if(!driver) {
        return next(new AppError('Invalid Driver Selected. Driver not found.' , 400))
    }
    const bookingExist = await VanBooking.findOne({ user : req.user._id , driver : driver._id , status : { $ne : 'completed' }});
    if(bookingExist) {
        return next(new AppError("You have already booked this van.", 400))
    }
    const newBooking = await VanBooking.create({
        user : req.user._id ,
        driver : driver._id ,
        customerLocation 
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
