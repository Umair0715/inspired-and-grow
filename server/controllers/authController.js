const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = require('twilio')(accountSid, authToken);
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.sendOtp = catchAsync( async(req ,res ,next) => {
    const { sid } = await twilioClient.verify.services.create({
        friendlyName: "phone verification",
    });
  
    const response = await twilioClient.verify.services(sid).verifications.create({
        to : '+923160680393' ,
        channel: "sms", // sms, call, or email
    });
    
    res.status(200).json({
        status : 'success' ,
        success : true ,
        data : {
            message : 'Please check your phone number.'
        }
    })
    
});