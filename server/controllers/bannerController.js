const Banner = require('../models/bannerModel');
const handlerFactory = require('./factories/handlerFactory');
const bannerValidation = require('../validations/bannerValidation');

const imgDirectory = 'banners';

exports.createBanner = handlerFactory.createOne(
    Banner , bannerValidation , imgDirectory
);
exports.getAllBanners = handlerFactory.getAll(Banner);
exports.getSingleBanner = handlerFactory.getOne(Banner);
exports.updateBanner = handlerFactory.updateOne(Banner);
exports.deleteBanner = handlerFactory.deleteOne(Banner)