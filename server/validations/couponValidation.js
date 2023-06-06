const joi = require('joi');

const couponValidation = joi.object().keys({
    name : joi.string().required() ,
    couponType : joi.string().required() ,
    discountType : joi.string().required() ,
    discount : joi.number().required() ,
    minOrder : joi.number().required() ,
    isActive : joi.boolean().required() ,
    startDate : joi.date().required() ,
    endDate : joi.date().required() ,
});

module.exports = couponValidation;