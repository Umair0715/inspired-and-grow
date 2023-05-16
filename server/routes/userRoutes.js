const router = require('express').Router();
const { register, login, getProfile, updateProfile, updatePassword, logout, getAllUsers, editUser, deleteUser , getSingleUser , createUser, googleLogin, facebookLogin } = require('../controllers/userController');
const { protect } = require('../middlewares/protect');
const User = require('../models/userModel');
const Admin = require('../models/adminModel');


router.post('/register' , register);
router.post('/login' , login);
router.route('/profile')
    .get(protect(User) , getProfile)
    .put(protect(User) , updateProfile);

router.post('/google-login' , googleLogin);
router.post('/facebook-login' , facebookLogin);

router.put('/update-password' , protect(User) , updatePassword);
router.get('/logout' , logout);

router.get('/all' , protect(Admin) , getAllUsers);
router.post('/create' , protect(Admin) , createUser);
router.put('/edit/:id' , protect(Admin) , editUser );
router.delete('/delete/:id' , protect(Admin) , deleteUser);
router.get('/details/:id' , protect(Admin) , getSingleUser)



module.exports = router;