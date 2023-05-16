const joi = require('joi'); 

const userValidation = joi.object().keys({
    firstName : joi.string().required().min(3) ,
    lastName : joi.string().required().min(3) ,
    email : joi.string().email().required() ,
    location : joi.string().optional() ,
    phone : joi.string().required() ,
    password : joi.string().optional() , 
    image : joi.string().optional()
});

module.exports = userValidation;