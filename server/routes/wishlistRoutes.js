const { 
    addWishlistItem, getMyWishlistItems, deleteWishlistItem
 } = require('../controllers/wishlistController');
const { protect } = require('../middlewares/protect');
const router = require('express').Router();
const User = require('../models/userModel');

router.route('/')
    .post(protect(User) , addWishlistItem)
    .get(protect(User) , getMyWishlistItems)

router.route('/:productId')
    .delete(protect(User) , deleteWishlistItem);

module.exports = router;