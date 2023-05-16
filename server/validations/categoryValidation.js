const joi = require('joi');

const categoryValidation = joi.object().keys({
    name : joi.string().required() ,
    image : joi.string().required() ,
});

module.exports = categoryValidation;