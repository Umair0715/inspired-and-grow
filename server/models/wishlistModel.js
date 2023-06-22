const mongoose = require('mongoose');

const WishlistSchema = new mongoose.Schema({
    product : {
        type : mongoose.Schema.ObjectId ,
        ref : 'Inventory' ,
        required : [true , 'Product is required.'] 
    } ,
    user : {
        type : mongoose.Schema.ObjectId ,
        ref : 'User' ,
        required : [true , 'User is required.'] 
    } ,  
} , { timestamps : true });

WishlistSchema.pre(/^find/ , function(next) {
    this.populate([
        {
            path : 'product' ,
            select : 'name stock price images mainCategory subCategory' ,
            populate : {
                path : 'mainCategory' ,
                select : 'name' 
            } ,
            populate : {
                path : 'subCategory' ,
                select : 'nae'
            }
        } , 
        {
            path : 'user',
            select : 'firstName lastName email image phone'
        }
    ]);
    next();
})

const Wishlist = mongoose.model('Wishlist' , WishlistSchema);
module.exports = Wishlist;