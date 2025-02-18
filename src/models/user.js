const mongoose = require('mongoose');
const validator = require('validator');

const genderEnum=["male", "female"]

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName:{
        type: String,
    },
    emailId:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email");
        }
    }
    },
    password: {
        type: String,
        required: true
    },
    age:{
        type: Number   
    },
    gender:{
        type: String,
        enum: genderEnum
    }
}, {timestamps: true});

//create user model
const User= mongoose.model("User", userSchema);

module.exports=User;      