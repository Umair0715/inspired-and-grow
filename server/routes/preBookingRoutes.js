const router = require('express').Router();
const { protect } = require('../middlewares/protect');
const User = require('../models/userModel');
const Admin = require('../models/adminModel');
const { createBooking, getAllBookings, updateBooking, deleteBookings, getSingleBooking, getMyBookings } = require('../controllers/preBookingController');


router.route('/')
    .post(protect(User) , createBooking)
    .get(getAllBookings);

router.get('/my' , protect(User) , getMyBookings )

router.route('/:id')
    .put(protect(Admin) , updateBooking)
    .get(getSingleBooking)
    .delete(protect(Admin) , deleteBookings)

module.exports = router;