const mongoose = require('mongoose');
const validator = require('validator');

const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Please enter your name."],
        trim: true,
        minlength:[4, "Name must be 4 characters."],
        maxlength:[30, "Name cannot exceed 30 characters."]
        
    },
    email:{
        type:String,
        required: [true, "Please enter your email."],
        unique: true,
       validator: [validator.isEmail, "Please enter valid email."]
    },
    password:{
        type: String,
        required:[true, "Please enter your password"],
        minlength:[6, "Password should be greater than 6 characters."],
    },
    role:{
        type:String,
        default: "user"
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
},
{timestamps:true});

module.exports = mongoose.model("User", UserSchema);