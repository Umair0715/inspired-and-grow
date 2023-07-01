const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const uploadImage = require('../utils/uploadImage');
const Inventory = require('../models/inventoryModel');
const inventoryValidation = require('../validations/inventoryValidation');
const { sendSuccessResponse } = require('../utils/helpers');
const handlerFactory = require('./factories/handlerFactory');

const populateObj = [
    {
        path : 'mainCategory' ,
        select : 'name image isActive'
    } ,
    {
        path : 'subCategory' ,
        select : 'name image isActive mainCategory'
    }
]

exports.createInventory = catchAsync(async(req , res , next) => {
    const { images } = req.body;
    const { error } = inventoryValidation.validate(req.body);
    if(error){
        return next(new AppError(error.details[0].message , 400))
    }
    const _images = images?.map(item => {
        const { fileName } = uploadImage(item , 'inventories');
        return fileName;
    })
    const newInventory = await Inventory.create({...req.body , images : _images });
    sendSuccessResponse(res , 201 , { 
        message : 'Inventory created successfully.' ,
        doc : newInventory 
    })
});

exports.getSingleInventory = handlerFactory.getOne(Inventory , populateObj );
exports.deleteInventory = handlerFactory.deleteOne(Inventory);

exports.getAllInventories = catchAsync(async(req , res , next) => {
    const page = Number(req.query.page) || 1 ;
    const sort = req.query.sort || -1;
    const pageSize = req.query.pageSize || 10;
    if(req.query.pageSize && req.query.pageSize > 25){
        return next(new AppError('pageSize should be less than or equal to 25' , 400));
    }
    const keyword = req.query.keyword ?
    {
        name : {
            $regex : req.query.keyword ,
            $options : 'i'
        }
    } : {} ;    

    let filter = {};
    if(req.query.mainCategory && req.query.subCategory){
        filter = { 
            mainCategory : req.query.mainCategory , 
            subCategory : req.query.subCategory 
        }
    }else if(req.query.subCategory){
        filter = { subCategory : req.query.subCategory }
    }else if (req.query.mainCategory){
        filter = { mainCategory : req.query.mainCategory }
    }

    const docCount = await Inventory.countDocuments({...keyword , ...filter });
    const docs = await Inventory.find({...keyword , ...filter })
    .populate(populateObj)
    .skip(pageSize * (page - 1))
    .limit(pageSize)
    .sort({ createdAt : sort })
    const pages = Math.ceil(docCount/pageSize);
    sendSuccessResponse(res , 200 , {
        docs , page , pages , docCount 
    });
});

exports.updateInventory = catchAsync(async(req , res , next) => {
    const { images } = req.body;
    if(images) {
        req.body.images = images?.map(item => {
            const { fileName } = uploadImage(item, 'inventories');
            return fileName;
        })
    }
    const inventory = await Inventory.findById(req.params.id);
    let updatedInventory = await Inventory.findByIdAndUpdate(req.params.id , {
        ...req.body , 
        images : [...req.body.images , ...inventory.images ]
    } , {
        new : true , 
        runValidators : true 
    })
    .populate(populateObj)
    sendSuccessResponse(res , 200 , {
        message : 'Inventory Updated successfully.' ,
        doc : updatedInventory
    })
});

exports.removeInventoryImage = catchAsync(async(req , res , next) => {
    const { image } = req.body;
    const { id } = req.params;
    const inventory = await Inventory.findById(id);
    inventory.images = inventory.images.filter(i => i !== image);
    const updatedInventory = await inventory.save();
    sendSuccessResponse(res , 200 , {
        message : 'Image removed successfully.' ,
        doc : updatedInventory
    })
});

exports.getTotalInventory = catchAsync(async ( req , res ) => {
    const docs = await Inventory.find({}).select('name');
    sendSuccessResponse(res , 200 , { docs })
});


exports.getSuggestedItems = catchAsync(async(req , res , next) => {
    const { type } = req.query;
    if(type === 'main') {

    }else if (type === 'sub') {

    }else {
        return next(new AppError('InValid type provided.', 400))
    }
})