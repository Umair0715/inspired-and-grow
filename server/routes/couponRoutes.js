const { createCoupon , getAllCoupons, getSingleCoupon, updateCoupon, deleteCoupon, applyCoupon } = require('../controllers/couponController');
const { protect } = require('../middlewares/protect');
const Admin = require('../models/adminModel');
const User = require('../models/userModel');
const router = require('express').Router();


router.route('/')
    .post(protect(Admin) , createCoupon)
    .get(getAllCoupons)

router.post('/apply' , protect(User) , applyCoupon)

router.route('/:id')
    .get(getSingleCoupon)
    .put(protect(Admin) , updateCoupon)
    .delete(protect(Admin) , deleteCoupon)


module.exports = router;