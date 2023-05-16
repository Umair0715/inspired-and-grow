const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const { sendSuccessResponse } = require('../../utils/helpers');
const signToken = require('../../utils/signToken');
const sendCookie = require('../../utils/sendCookies');


exports.login = (Model , populateItems = '') => catchAsync(async(req , res , next) => {
    const { email , password } = req.body;
    if(!email || !password){
        return next(new AppError('All fields are required.' , 400))
    }
    let doc ;
    if(populateItems){
        doc = await Model.findOne({ email })
        .populate(populateItems)
    }else {
        doc = await Model.findOne({ email })
    }
    if(!doc || !(await doc.comparePassword(password))){
        return next(new AppError('Wrong email or password'));
    }
    const token = signToken({ _id : doc._id });
    sendCookie(res , token);
    doc.password = '';
    return sendSuccessResponse(res , 200 , {
        message : 'Logged in successfully.' ,
        doc : {...doc._doc , token } 
    })
});

exports.profile = Model => catchAsync(async(req , res ,next) => {
    const doc = await Model.findById(req.user._id);
    if(!doc) return next(new AppError('Document not found.' , 404));
    doc.password = '';
    return sendSuccessResponse(res , 200 , {
        doc 
    })
});

exports.logout = Model => (req , res , next) =>{
    res.cookie('token' , 'loggedOut' , {
        expires : new Date(Date.now() + 10 * 1000), 
        httpOnly : true 
    });
    return sendSuccessResponse(res , 200 , {
        message : 'Logged out successfully.'
    })
}

exports.updatePassword = Model => catchAsync(async(req , res , next) => {
    const { oldPassword , newPassword , passwordConfirm } = req.body;
    if(!oldPassword || !newPassword || !passwordConfirm){
        return next(new AppError('Missing required credentials.' , 400))
    }
    const doc = await Model.findById(req.user._id);
    if(!(await doc.comparePassword(oldPassword))){
        return next(new AppError('Unable to change password.' , 400))
    }
    if(newPassword !== passwordConfirm){
        return next(new AppError('Passwords are not matched.' , 400))
    }
    doc.password = newPassword;
    await doc.save();
    sendSuccessResponse(res , 200 , {
        message : 'Password updated successfully.' ,
    });
});

exports.updateProfile = (Model , imgDirectory = '') => catchAsync(async(req , res , next) => {
    const { image } = req.body;
    if(image) {
        const { fileName } = uploadImage(image , imgDirectory);
        req.body.image = fileName;
    }
    const updateDoc = await Model.findByIdAndUpdate(req.user._id , req.body , {
        new : true , 
        runValidators : true 
    });
    
    sendSuccessResponse(res , 200 , {
        message : 'Profile updated successfully.' ,
        doc : updateDoc
    })
});

exports.block = (Model) => catchAsync(async(req , res , next) => {
    const { id } = req.params;
    const blockedUser = await Model.findByIdAndUpdate(id , { isActive : false } , {
        new : true , 
        runValidators : true 
    });
    sendSuccessResponse(res , 200 , {
        message : 'User Blocked successfully.' ,
        doc : blockedUser
    })
})