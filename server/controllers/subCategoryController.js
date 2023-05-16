const handlerFactory = require('./factories/handlerFactory');
const SubCategory = require('../models/subCategoryModel');
const subCategoryValidation = require('../validations/subCategoryValidation');
const catchAsync = require('../utils/catchAsync');
const { sendSuccessResponse } = require('../utils/helpers');

exports.createSubCategory = handlerFactory.createOne(SubCategory , subCategoryValidation , 'categories');

exports.getAllSubCategories = handlerFactory.getAll(SubCategory , 'mainCategory');
exports.getSingleSubCategory = handlerFactory.getOne(SubCategory , 'mainCategory');
exports.deleteSubCategory = handlerFactory.deleteOne(SubCategory);
exports.editSubCategory = handlerFactory.updateOne(SubCategory , 'categories');

exports.getSpecificCategories = catchAsync(async(req , res) => {
    const docs = await SubCategory.find({ mainCategory : req.params.mainCatId })
    .populate('mainCategory' , 'name');
    sendSuccessResponse(res , 200 , { docs });
})