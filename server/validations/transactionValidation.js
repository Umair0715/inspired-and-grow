const joi = require('joi');

const transactionValidation = joi.object().keys({
    amount : joi.number().required() ,
    to : joi.string().optional() ,
    fromWalletType : joi.number().required() ,
    toSelf : joi.boolean().required() ,
});

module.exports = transactionValidation;