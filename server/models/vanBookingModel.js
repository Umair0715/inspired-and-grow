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
        lat : {
            type : String ,
            required : [true , 'Latitude is required.']
        } ,
        lng : {
            type : String ,
            required : [true , 'Logitude is required.']
        }
    } , 
    date : {
        type : Date ,
        required : [true , 'Booking date is required.']
    } ,
    username : {
        type : String , 
        required : [true , 'Username is required.']
    }

} , { timestamps : true });

const VanBooking = mongoose.model('VanBooking' , vanBookingSchema);
module.exports = VanBooking;