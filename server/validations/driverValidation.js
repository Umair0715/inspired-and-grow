const joi = require('joi'); 

const dirverValidation = joi.object().keys({
    firstName : joi.string().required().min(3) ,
    lastName : joi.string().required().min(3) ,
    email : joi.string().email().required() ,
    location : joi.string().optional() ,
    phone : joi.string().required() ,
    password : joi.string().optional() , 
    image : joi.string().optional(),
    route : joi.string().required() ,
    fcm_token : joi.string().required() 
});

module.exports = dirverValidation;