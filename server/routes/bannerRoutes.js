const { getAllBanners, createBanner, updateBanner, getSingleBanner, deleteBanner } = require('../controllers/bannerController');
const { protect } = require('../middlewares/protect');
const Admin = require('../models/adminModel');
const router = require('express').Router();

router.route('/')
    .get(getAllBanners)
    .post(protect(Admin) , createBanner)


router.route('/:id')
    .put(protect(Admin) , updateBanner)
    .get(getSingleBanner)
    .delete(protect(Admin) , deleteBanner)


module.exports = router;