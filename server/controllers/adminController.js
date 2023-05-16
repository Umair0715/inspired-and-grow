const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/userModel');
const adminValidation = require('../validations/adminValidation');
const sendCookie = require('../utils/sendCookies');
const signToken = require('../utils/signToken');
const { sendSuccessResponse } = require('../utils/helpers');
const userFactory = require('./factories/userFactory');
const Admin = require('../models/adminModel');

exports.register = catchAsync(async(req , res , next) => {
    const { email } = req.body;
    const { error } = adminValidation.validate(req.body);
    if(error){
        return next(new AppError(error.details[0].message , 400))
    }
    const adminExist = await Admin.findOne({ email });
    if(adminExist){
        return next(new AppError('Email already taken. Please try another.' , 400));
    }
    const newAdmin = await Admin.create(req.body);
    await newAdmin.save();
    const token = signToken({ _id : newAdmin._id })
    sendCookie(res , token);
    newAdmin.password = '';
    sendSuccessResponse(res , 201 , {
        message : 'Admin Registered Successfully.' ,
        doc : {...newAdmin._doc , token }
    })
});

exports.login = userFactory.login(Admin)
exports.getProfile = userFactory.profile(Admin);
exports.logout = userFactory.logout(Admin);
exports.updatePassword = userFactory.updatePassword(Admin);
exports.updateProfile = userFactory.updateProfile(Admin , 'admins');

