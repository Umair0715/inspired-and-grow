const joi = require('joi');

const subCategoryValidation = joi.object().keys({
    name : joi.string().required() ,
    image : joi.string().required() ,
    mainCategory : joi.string().required() ,
});

module.exports = subCategoryValidation;