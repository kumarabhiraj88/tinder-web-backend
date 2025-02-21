const mongoose = require('mongoose');

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
        trim: true
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
        enum: {
            values: genderEnum,
            message: '{VALUE} is incorrect gender type'
        }
    }
}, {timestamps: true});

//create user model
const User= mongoose.model("User", userSchema);

module.exports=User;      