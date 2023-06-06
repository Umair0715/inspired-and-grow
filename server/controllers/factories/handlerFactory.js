const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const { sendSuccessResponse } = require('../../utils/helpers');
const uploadImage = require('../../utils/uploadImage');


exports.createOne = (Model , docValidation = null , imgDirectory) => catchAsync(async(req , res , next) => {
    const { image } = req.body;
    if(docValidation){
        const { error } = docValidation.validate(req.body);
        if(error){
            return next(new AppError(error.details[0].message , 400))
        }
    } 
    if(image){
        const { fileName } = uploadImage(image , imgDirectory);
        req.body.image = fileName;
    }
    const newDoc = await Model.create(req.body);
    return sendSuccessResponse(res , 200 , {
        message : 'Document Created successfully.' ,
        doc : newDoc 
    })
});

exports.getAll = (Model, populateItems = '') => catchAsync(async(req , res , next) => {
    const page = Number(req.query.page) || 1 ;
    const sort = req.query.sort || -1;
    const pageSize = req.query.pageSize || 10;
    if(req.query.pageSize && req.query.pageSize > 25){
        return next(new AppError('pageSize should be less than or equal to 25' , 400));
    }
    const status = req.query.status;
    let filter = {};
    if(status) {
        filter = { status }
    }
    const keyword = req.query.keyword ?
    {
        name : {
            $regex : req.query.keyword ,
            $options : 'i'
        }
    } : {} ;    
    const docCount = await Model.countDocuments({...filter , ...keyword});
    const docs = await Model.find({...filter , ...keyword})
    .populate(populateItems)
    .skip(pageSize * (page - 1))
    .limit(pageSize)
    .sort({ createdAt : sort })
    const pages = Math.ceil(docCount/pageSize);
    sendSuccessResponse(res , 200 , {
        docs , page , pages , docCount 
    });
});

exports.getOne = (Model, populateItems) => catchAsync(async(req , res , next) => {
    const { id } = req.params;
    const doc = await Model.findById(id)
    .populate(populateItems)
    if(!doc) return next(new AppError('Invalid id. Document not found.' , 404))
    sendSuccessResponse(res , 200 , { doc })
})

exports.updateOne = (Model , imgDirectory , populateItems = '') => catchAsync(async(req , res , next) => {
    const { id } = req.params;
    const { image } = req.body;
    if(image) {
        const { fileName } = uploadImage(image , imgDirectory);
        req.body.image = fileName;
    }
    const updatedDoc = await Model.findByIdAndUpdate(id , req.body , {
        new : true ,
        runValidators : true 
    })
    .populate(populateItems)

    if(!updatedDoc) return next(new AppError('Invalid id provided.' , 404))
    return sendSuccessResponse(res , 200 , {
        message : 'Document updated successfully.',
        doc : updatedDoc
    })
})

exports.deleteOne = Model => catchAsync(async( req , res , next) => {
    const doc = await Model.findById(req.params.id);
    if(!doc){
        return next(new AppError('Document not found.' , 404))
    }
    await Model.findByIdAndDelete(req.params.id);
    sendSuccessResponse(res , 200 , {
        message : 'Document deleted successfully.' 
    })
});

exports.getMy = (Model , populateItems) => catchAsync(async(req , res , next) => {
    const page = req.query.page || 1 ;
    const sort = req.query.sort || -1;
    const pageSize = req.query.pageSize || 10 ;
    if(req.query.pageSize && req.query.pageSize > 25){
        return next(new AppError('pageSize should be less than or equal to 25' , 400))
    }
    const keyword = req.query.keyword ?
    {
        name : {
            $regex : req.query.keyword ,
            $options : 'i'
        }
    } : {} ;
    const status = req.query.status;
    let filter = {};
    if(status) {
        filter = { status }
    }
    const docCount = await Model.countDocuments({...filter , ...keyword , user : req.user._id });
    const docs = await Model.find({...filter , ...keyword , user : req.user._id })
    .populate(populateItems)
    .skip(pageSize * (page - 1))
    .limit(pageSize)
    .sort({ createdAt : sort })
    const pages = Math.ceil(docCount/pageSize);
    sendSuccessResponse(res , 200 , {
        docs , page , pages , docCount 
    })
});

exports.getSpecific = (Model , populateItems) => catchAsync(async(req , res , next) => {
    const page = req.query.page || 1 ;
    const sort = req.query.sort || -1;
    const pageSize = req.query.pageSize || 10 ;
    if(req.query.pageSize && req.query.pageSize > 25){
        return next(new AppError('pageSize should be less than or equal to 25' , 400))
    }
    const keyword = req.query.keyword ?
    {
        name : {
            $regex : req.query.keyword ,
            $options : 'i'
        }
    } : {} ;
    const docCount = await Model.countDocuments({...keyword , user : req.params.id });
    const docs = await Model.find({...keyword , user : req.params.id })
    .populate(populateItems)
    .skip(pageSize * (page - 1))
    .limit(pageSize)
    .sort({ createdAt : sort })
    const pages = Math.ceil(docCount/pageSize);
    sendSuccessResponse(res , 200 , {
        docs , page , pages , docCount 
    })
}); 

exports.getTotal = Model => catchAsync(async(req , res) => {
    const docs = await Model.find({ isActive : true });
    sendSuccessResponse(res , 200 , { docs })
})

