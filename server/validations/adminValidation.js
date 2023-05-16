const joi = require('joi'); 

const adminValidation = joi.object().keys({
    firstName : joi.string().required().min(3) ,
    lastName : joi.string().required().min(3) ,
    email : joi.string().email().required() ,
    password : joi.string().optional() , 
    isSuperAdmin : joi.optional()
});

module.exports = adminValidation;