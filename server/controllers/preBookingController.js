const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const preBookingValidation = require('../validations/preBookingValidation');
const { sendSuccessResponse } = require('../utils/helpers');
const handlerFactory = require('./factories/handlerFactory');
const PreBooking = require('../models/preBookingModel');

const populateObj = [
    {
        path : 'user' ,
        select : 'firstName lastName email phone location image'
    } , 
    {
        path : 'driver' ,
        select : 'firstName lastName email phone location image'
    }
]

exports.createBooking = catchAsync(async(req , res , next) => {
    const { error } = preBookingValidation.validate(req.body);
    if(error) {
        return next(new AppError(error.details[0].message , 400))
    }
    const newBooking = await PreBooking.create({
        ...req.body ,
        user : req.user._id ,
        username : req.user.firstName + " " + req.user.lastName 
    });
    return sendSuccessResponse(res , 201 , {
        message : 'Booking created successfully.' ,
        doc : newBooking 
    })
});

exports.updateBooking = handlerFactory.updateOne(PreBooking , '' , populateObj);

const fetchBookings = async (req , res , query) => {
    const page = Number(req.query.page) || 1 ;
    const sort = req.query.sort || -1;
    const pageSize = req.query.pageSize || 10;
    if(req.query.pageSize && req.query.pageSize > 25){
        return next(new AppError('pageSize should be less than or equal to 25' , 400));
    }
    const keyword = req.query.keyword ?
    {
        username : {
            $regex : req.query.keyword ,
            $options : 'i'
        }
    } : {} ;    
    const status = req.query.status;
    let docCount ;
    let docs;
    if(status) {
        docCount = await PreBooking.countDocuments({ status , ...keyword , ...query });
        docs = await PreBooking.find({ status , ...keyword })
        .populate(populateObj)
        .skip(pageSize * (page - 1))
        .limit(pageSize)
        .sort({ createdAt : sort })
    }else {
        docCount = await PreBooking.countDocuments({...keyword , ...query });
        docs = await PreBooking.find(keyword)
        .populate(populateObj)
        .skip(pageSize * (page - 1))
        .limit(pageSize)
        .sort({ createdAt : sort })
    }
    const pages = Math.ceil(docCount/pageSize);
    sendSuccessResponse(res , 200 , {
        docs , page , pages , docCount 
    });
}

exports.getMyBookings = catchAsync(async(req , res , next) => {
    await fetchBookings(req , res , { user : req.user._id })
});

exports.getAllBookings = catchAsync(async(req , res ) => {
    await fetchBookings(req , res , {});
});

exports.getMyBookings = catchAsync(async(req , res ) => {
    await fetchBookings(req , res , { user : req.user._id });
});


exports.deleteBookings = handlerFactory.deleteOne(PreBooking);
exports.getSingleBooking = handlerFactory.getOne(PreBooking , populateObj);