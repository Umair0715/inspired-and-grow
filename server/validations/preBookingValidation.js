const joi = require('joi');

const preBookingValidation = joi.object().keys({
    driver : joi.string().required() ,
    location : joi.string().required() ,
    date : joi.string().required() ,
});

module.exports = preBookingValidation;