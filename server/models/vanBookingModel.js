const mongoose = require('mongoose');


const vanBookingSchema = new mongoose.Schema({
    driver : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'Driver' ,
        required : [true , 'Driver id is required.'] ,
        index : true 
    } ,
    user : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'User' ,
        required : [true , 'User id is required.'],
        index : true
    } , 
    status : {
        type : String ,
        enum : ['pending' , 'processing' , 'onTheWay' , 'cancelled' , 'completed'] ,
        default : 'pending'
    } ,
    amount : {
        type : Number ,
    } , 
    customerLocation : {
        type : String ,
        required : [true , 'Customer location is required.']
    }

} , { timestamps : true });

const VanBooking = mongoose.model('VanBooking' , vanBookingSchema);
module.exports = VanBooking;