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
const axios = require('axios')
const moment = require('moment')

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
exports.createUser = handlerFactory.createOne(User , userValidation , 'users');


const generateOtp = async () => {
    var ID = require("nodejs-unique-numeric-id-generator")
    const otp = ID.generate(new Date().toJSON());
    const user = await User.findOne({ resetPasswordToken : otp , resetPasswordTokenExpire : { $gt : new Date() } })

    if(otp.toString().length < 6 || user) {
        return await generateOtp();
    }
    return otp;
}

exports.sendForgotPasswordOtp = catchAsync(async(req , res , next) => {
    const { phone } = req.body;
    const user = await User.findOne({ phone });
    if(!user) {
        return next(new AppError('This Phone number is not registered with any account.' , 400))
    }
    const otp = await generateOtp()
    const message = `Dear ${user.firstName + " " + user.lastName} your login OTP is ${otp}, regards inspired grow.`;
    // const message = `Dear Shekhar your login OTP is ${otp}, regards inspired grow.`;

    const url = `https://www.smsstriker.com/API/sms.php?username=${process.env.SMS_USERNAME}&password=${process.env.SMS_PASSWORD}&from=${process.env.SMS_SENDER_ID}&to=${phone}&msg=${message}&type=1&template_id=${process.env.SMS_TEMPLATE_ID}`;
    try {
        const resp = await axios.get(url);
        const currentDate = moment();
        user.resetPasswordToken = otp;
        user.resetPasswordTokenExpire = moment(currentDate).add(10, 'minutes');
        await user.save();
        
        return sendSuccessResponse(res , 200 , {
            message : 'Otp sended.'
        })
    } catch (error) {
        console.log({ otpError : error });
        return next(new AppError('Internal server error' , 500))
    }
});

exports.verifyOtp = catchAsync(async(req , res , next) => {
    const { otp } = req.body;
    if(!otp) return next(new AppError('Otp is required.' , 400))
    const user = await User.findOne({ resetPasswordToken : otp });
    if(!user) {
        return next(new AppError("Invalid otp." , 400))
    }
    if(new Date(user.resetPasswordTokenExpire) < new Date()) {
        return next(new AppError('Otp has been expired. Please try again with new otp.' , 400))
    }
    sendSuccessResponse(res , 200 , {
        message : 'Otp Verified.' , 
        doc : {
            otp ,
            verified : true 
        }
    })
}); 

exports.resetPassword = catchAsync(async(req , res , next) => {
    const { phone , newPassword , confirmPassword } = req.body;
    const user = await User.findOne({ phone });
    if(confirmPassword && newPassword !== confirmPassword) {
        return next(new AppError('Passwords are incorrect.' , 400))
    }
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpire = undefined;
    await user.save();
    sendSuccessResponse(res , 200 , {
        message : 'Password changed successfully.' ,
    });
});