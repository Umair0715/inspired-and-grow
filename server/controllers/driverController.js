const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Driver = require('../models/driverModel');
const driverValidation = require('../validations/driverValidation');
const { sendSuccessResponse } = require('../utils/helpers');
const userFactory = require('./factories/userFactory');
const uploadImage = require('../utils/uploadImage');
const handlerFactory = require('./factories/handlerFactory');

exports.register = catchAsync(async(req , res , next) => {
    const { email , image } = req.body;
    const { error } = driverValidation.validate(req.body);
    if(error){
        return next(new AppError(error.details[0].message , 400))
    }
    const userExist = await Driver.findOne({ email });
    if(userExist){
        return next(new AppError('Email already taken. Please try another.' , 400));
    }
    if(image) {
        const { fileName } = uploadImage(image , 'drivers');
        req.body.image = fileName;
    }
    const newDriver = await Driver.create({...req.body });
    newDriver.password = '';
    sendSuccessResponse(res , 201 , {
        message : 'Driver Registered Successfully.' ,
        doc : {...newDriver._doc }
    })
});

exports.login = userFactory.login(Driver)
exports.getProfile = userFactory.profile(Driver);
exports.logout = userFactory.logout(Driver);
exports.updateProfile = userFactory.updateProfile(Driver , 'drivers')
exports.updatePassword = userFactory.updatePassword(Driver);

exports.getAllDrivers = catchAsync(async(req , res , next) => {
    const page = Number(req.query.page) || 1 ;
    const sort = req.query.sort || -1;
    const pageSize = req.query.pageSize || 10;
    if(req.query.pageSize && req.query.pageSize > 25){
        return next(new AppError('pageSize should be less than or equal to 25' , 400));
    }
    const keyword = req.query.keyword ?
    {
        $or : [
            {
                firstName : {
                    $regex : req.query.keyword ,
                    $options : 'i'
                } 
            } ,
            {
                lastName : {
                    $regex : req.query.keyword ,
                    $options : 'i'
                }
            }
        ]
    } : {} ;   

    const range = req.query.range;

    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    let filter = {};
    if (range === 'today') {
        filter = { createdAt: { $gte: start, $lte: end } };
    } else if (range === 'week') {
        start.setDate(start.getDate() - 7);
        filter = { createdAt: { $gte: start, $lte: end } };
    } else if (range === 'month') {
        start.setMonth(start.getMonth() - 1);
        filter = { createdAt: { $gte: start, $lte: end } };
    } else if (range === 'year') {
        start.setFullYear(start.getFullYear() - 1);
        filter = { createdAt: { $gte: start, $lte: end } };
    }
    
    const docCount = await Driver.countDocuments({...keyword , ...filter});
    const docs = await Driver.find({...keyword , ...filter})
    .skip(pageSize * (page - 1))
    .limit(pageSize)
    .sort({ createdAt : sort })
    const pages = Math.ceil(docCount/pageSize);
    sendSuccessResponse(res , 200 , {
        docs , page , pages , docCount 
    });
});

exports.deleteDriver = handlerFactory.deleteOne(Driver);
exports.editDriver = handlerFactory.updateOne(Driver , 'drivers');
exports.getSingleDriver = handlerFactory.getOne(Driver);
exports.blockDriver = userFactory.block(Driver);