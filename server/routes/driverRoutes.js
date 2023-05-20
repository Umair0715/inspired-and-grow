const router = require('express').Router();
const { register, login, getProfile, updateProfile, updatePassword, logout, getAllDrivers, editDriver, deleteDriver , getSingleDriver } = require('../controllers/driverController');
const { protect } = require('../middlewares/protect');
const Driver = require('../models/driverModel');
const Admin = require('../models/adminModel');


router.post('/register' , register);
router.post('/login' , login);
router.route('/profile')
    .get(protect(Driver) , getProfile)
    .put(protect(Driver) , updateProfile);


router.put('/update-password' , protect(Driver) , updatePassword);
router.get('/logout' , logout);

router.get('/all' , protect(Admin) , getAllDrivers);
router.put('/edit/:id' , protect(Admin) , editDriver );
router.delete('/delete/:id' , protect(Admin) , deleteDriver);
router.get('/details/:id' , protect(Admin) , getSingleDriver)



module.exports = router;