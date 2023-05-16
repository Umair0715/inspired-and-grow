const { getAllCategories, createCategory, editCategory, getSingleCategory, deleteCategory, getTotalCategories } = require('../controllers/categoryController');
const { protect } = require('../middlewares/protect');
const Admin = require('../models/adminModel');
const router = require('express').Router();

router.route('/')
    .get(getAllCategories)
    .post(protect(Admin) , createCategory)

router.get('/total' , getTotalCategories );

router.route('/:id')
    .put(protect(Admin) , editCategory)
    .get(getSingleCategory)
    .delete(protect(Admin) , deleteCategory)


module.exports = router;