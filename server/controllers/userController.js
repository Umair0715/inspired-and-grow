const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/userModel');
const userValidation = require('../validations/userValidation');
const sendCookie = require('../utils/sendCookies');
const signToken = require('../utils/signToken');
const { sendSuccessResponse } = require('../utils/helpers');
const userFactory = require('./factories/userFactory');
const uploadImage = require('../utils/uploadImage');
const handlerFactory = require('./factories/handlerFactory');

exports.register = catchAsync(async(req , res , next) => {
    const { email , image } = req.body;
    const { error } = userValidation.validate(req.body);
    if(error){
        return next(new AppError(error.details[0].message , 400))
    }
    const userExist = await User.findOne({ email });
    if(userExist){
        return next(new AppError('Email already taken. Please try another.' , 400));
    }
    if(image) {
        const { fileName } = uploadImage(image , 'users');
        req.body.image = fileName;
    }
    const newUser = await User.create({...req.body });
    const token = signToken({ _id : newUser._id })
    sendCookie(res , token);
    newUser.password = '';
    sendSuccessResponse(res , 201 , {
        message : 'Registered Successfully.' ,
        doc : {...newUser._doc , token }
    })
});

exports.googleLogin = catchAsync(async(req , res , next) => {
    const { email , name , image } = req.body;
    const userExist = await User.findOne({ email });
    if(userExist){
        const token = signToken({ _id : newUser._id });
        sendCookie(res , token);
        sendSuccessResponse(res , 200 , {
            new : false ,
            doc : {...userExist._doc , token }
        })
    }else {
        const newUser = await User.create({ 
            firstName : name , 
            email , image  ,
            accountType : 'google'
        });
        const token = signToken({ _id : newUser._id });
        sendCookie(res , token);
        sendSuccessResponse(res , 201 , {
            new : true ,
            doc : {...newUser._doc , token }
        })
    }
})

exports.facebookLogin = catchAsync(async(req , res , next) => {
    const { email , name , image } = req.body;
    const userExist = await User.findOne({ email });
    if(userExist){
        const token = signToken({ _id : newUser._id });
        sendCookie(res , token);
        sendSuccessResponse(res , 200 , {
            new : false ,
            doc : {...userExist._doc , token }
        })
    }else {
        const newUser = await User.create({ 
            firstName : name , 
            email , image  ,
            accountType : 'facebook'
        });
        const token = signToken({ _id : newUser._id });
        sendCookie(res , token);
        sendSuccessResponse(res , 201 , {
            new : true ,
            doc : {...newUser._doc , token }
        })
    }
})

exports.login = userFactory.login(User)
exports.getProfile = userFactory.profile(User);
exports.logout = userFactory.logout(User);
exports.updateProfile = userFactory.updateProfile(User , 'users')
exports.updatePassword = userFactory.updatePassword(User);

exports.getAllUsers = catchAsync(async(req , res , next) => {
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
    
    const docCount = await User.countDocuments({...keyword , ...filter});
    const docs = await User.find({...keyword , ...filter})
    .skip(pageSize * (page - 1))
    .limit(pageSize)
    .sort({ createdAt : sort })
    const pages = Math.ceil(docCount/pageSize);
    sendSuccessResponse(res , 200 , {
        docs , page , pages , docCount 
    });
});

exports.deleteUser = handlerFactory.deleteOne(User);
exports.editUser = handlerFactory.updateOne(User , 'users');
exports.getSingleUser = handlerFactory.getOne(User);
exports.blockUser = userFactory.block(User);
exports.createUser = handlerFactory.createOne(User , userValidation , 'users')