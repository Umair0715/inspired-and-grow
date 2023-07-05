const router = require('express').Router();
const { protect } = require('../middlewares/protect');
const User = require('../models/userModel');
const Admin = require('../models/adminModel');
const { createBooking, getAllBookings, updateBooking, getBookingDetails, deleteBooking, getMyBookings } = require('../controllers/vanBookingController');


router.route('/')
    .post(protect(User) , createBooking)
    .get(getAllBookings)

router.get('/my' , protect(User) , getMyBookings)

router.route('/:id')
    .put(protect(Admin) , updateBooking)
    .get(getBookingDetails)
    .delete(protect(Admin) , deleteBooking);


module.exports = router;