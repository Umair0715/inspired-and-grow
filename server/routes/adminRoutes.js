const router = require('express').Router();
const { register, login, getProfile , logout, updatePassword, updateProfile } = require('../controllers/adminController');
const { protect } = require('../middlewares/protect');
const Admin = require('../models/adminModel');

router.post('/register' , register);
router.post('/login' , login);
router.route('/profile')
    .get(protect(Admin) , getProfile)
    .put(protect(Admin) , updateProfile)

router.get('/logout' , logout);
router.put('/update-password' , protect(Admin) , updatePassword)




module.exports = router;