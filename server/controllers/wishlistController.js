const handlerFactory = require('./factories/handlerFactory');
const Wishlist = require('../models/wishlistModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { sendSuccessResponse } = require('../utils/helpers');


exports.addWishlistItem = catchAsync(async(req , res , next) => {
    const { product } = req.body;
    if(!product) {
        return next(new AppError('Product id is required.' , 400))
    }
    const itemExist = await Wishlist.findOne({ user : req.user._id , product });
    if(itemExist) {
        return next(new AppError('Item already exist in your wishlist.' , 400))
    }
    const doc = await Wishlist.create({
        product , user : req.user._id 
    });
    sendSuccessResponse(res , 200 , { 
        message : 'Item added to wishlist successfully.' ,
        doc 
    })
})
exports.getMyWishlistItems = handlerFactory.getMy(Wishlist);
exports.deleteWishlistItem = catchAsync(async(req , res , next) => {
    const { productId } = req.params;
    if(!productId) {
        return next(new AppError('Product id is required.' , 400))
    }
    await Wishlist.findOneAndDelete({ user : req.user._id , product : productId });
   
    sendSuccessResponse(res , 200 , { 
        message : 'Item removed from wishlist successfully.' ,
    })
})


