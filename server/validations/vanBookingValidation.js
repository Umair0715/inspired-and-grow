const joi = require('joi');

const vanBookingValidation = joi.object().keys({
    driverId : joi.string().required() ,
    date : joi.string().required() ,
    customerLocation : joi.object({
        lat: joi.string().required().messages({
            'string.base': 'Latitude must be a string.',
            'any.required': 'Latitude is required.',
        }),
        lng: joi.string().required().messages({
            'string.base': 'Longitude must be a string.',
            'any.required': 'Longitude is required.',
        }),
    }),

});

module.exports = vanBookingValidation;