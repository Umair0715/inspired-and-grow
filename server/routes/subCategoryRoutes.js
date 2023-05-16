const { getAllSubCategories, createSubCategory, editSubCategory, getSingleSubCategory, deleteSubCategory , getSpecificCategories } = require('../controllers/subCategoryController');
const { protect } = require('../middlewares/protect');
const Admin = require('../models/adminModel');
const router = require('express').Router();

router.route('/')
    .get(getAllSubCategories)
    .post(protect(Admin) , createSubCategory);

router.get('/all/:mainCatId' , getSpecificCategories)

router.route('/:id')
    .put(protect(Admin) , editSubCategory)
    .get(getSingleSubCategory)
    .delete(protect(Admin) , deleteSubCategory)

module.exports = router;