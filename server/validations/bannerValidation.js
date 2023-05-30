const joi = require('joi'); 

const bannerValidation = joi.object().keys({
    name : joi.string().required() ,
    description : joi.string().required() ,
    type : joi.string().required() ,
    bannerItem : joi.string().required() ,
    startDate : joi.date().required() ,
    endDate : joi.date().required() , 
    image : joi.string().required() ,
    offer : joi.string().optional()
});

module.exports = bannerValidation;