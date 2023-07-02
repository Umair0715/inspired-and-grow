const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const driverSchema = new mongoose.Schema({
    firstName : {
        type : String ,
        trim : true ,
        default : null 
    } ,
    lastName : {
        type : String ,
        trim : true ,
        default : null 
    } ,
    email : {
        type : String ,
        trim : true ,
        default : null 
    } ,
    phone : {
        type : String ,
        trim : true , 
        default : null 
    } ,
    location : {
        type : String ,
        default : null 
    } ,
    image : {
        type : String ,
        default : 'default.png' 
    } ,
    password : {
        type : String ,
        default : null 
    } ,
    isActive : {
        type : Boolean ,
        default : true 
    } ,
    route : {
        type : String ,
        required : [true , 'Driver Route is required.']
    } ,
    fcm_token : {
        type : String 
    }
} , { timestamps : true } );


driverSchema.pre('save' , async function(next) {
    if(!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password , 10);
    next();
});

driverSchema.methods.comparePassword = async function (givenPassword) {
    return await bcrypt.compare(givenPassword , this.password)
};

const Driver = mongoose.model('Driver' , driverSchema);
module.exports = Driver;