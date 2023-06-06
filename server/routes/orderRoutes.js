const { createOrder, getAllOrders, getSingleOrder, updateOrder, deleteOrder, getMyOrders } = require('../controllers/orderController');
const { protect } = require('../middlewares/protect');
const Admin = require('../models/adminModel');
const User = require('../models/userModel');
const router = require('express').Router();


router.route('/')
    .post(protect(User) , createOrder)
    .get(getAllOrders)

router.get('/my' , protect(User) , getMyOrders)

router.route('/:id')
    .get(getSingleOrder)
    .put(updateOrder)
    .delete(protect(Admin) , deleteOrder)


module.exports = router;