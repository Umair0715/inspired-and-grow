const mongoose = require('mongoose');

const preBookingSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'User' ,
        required : [true , 'User is required.'] ,
        index : true 
    } ,
    driver : { // basically van booking driver booking hi h , user van book kry ga but asal me driver book hoga
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'Driver' ,
        required : [true , 'driver is required.'] ,
        index : true 
    } ,
    location : {
        type : String ,
        required : [true , 'Location is required.']
    } ,
    date : {
        type : String ,
        required : [true , 'date is required.']
    } ,
    status : {
        type : String ,
        enum : ['completed' , 'accepted' , 'pending' , 'failed' , 'cancelled'] ,
        default : 'pending'
    } , 
    username : {
        type : String , 
        required : [true , 'Username is required.']
    }
} , { timestamps : true });

const PreBooking = mongoose.model('ProBooking' , preBookingSchema);
module.exports = PreBooking;