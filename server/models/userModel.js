const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
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
    accountType : {
        type : String ,
        enum : ['phone' , 'google' , 'facebook' , 'email'] ,
        default : 'email'
    } , 
    fcm_token : {
        type : String ,
    } , 
    resetPasswordToken : {
        type : String ,
        default : null
    } , 
    resetPasswordTokenExpire : {
        type : Date ,
        default : null 
    }
} , { timestamps : true });

userSchema.pre('save' , async function(next) {
    if(!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password , 10);
    next();
});

userSchema.methods.comparePassword = async function (givenPassword) {
    return await bcrypt.compare(givenPassword , this.password)
}

const User = mongoose.model('User' , userSchema);
module.exports = User;