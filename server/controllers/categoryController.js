const handlerFactory = require('./factories/handlerFactory');
const Category = require('../models/categoryModel');
const categoryValidation = require('../validations/categoryValidation');

exports.createCategory = handlerFactory.createOne(Category , categoryValidation , 'categories');

exports.getAllCategories = handlerFactory.getAll(Category);
exports.getSingleCategory = handlerFactory.getOne(Category);
exports.deleteCategory = handlerFactory.deleteOne(Category);
exports.editCategory = handlerFactory.updateOne(Category , 'categories');
exports.getTotalCategories = handlerFactory.getTotal(Category);
