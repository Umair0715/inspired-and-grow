const joi = require('joi');

const packageValidation = joi.object().keys({
    name : joi.string().required() ,
    keywords : joi.optional() ,
    images : joi.array().optional() ,
    stock : joi.number().required() ,
    unit : joi.string().required() ,
    mainCategory : joi.string().required(),
    subCategory : joi.string().required(),
    price : joi.number().required() 
   
});

module.exports = packageValidation;