const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

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
    },
    photoUrl:{
        type: String
    },
    about:{
        type: String
    }
}, {timestamps: true});

//create a schema method for getting JWT token
userSchema.methods.getJWT=async function(){
    const user = this;
    const token = await jwt.sign({_id: user._id}, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRE
    });
    return token;
}

//create a schema method for validate password
userSchema.methods.validatePassword=async function(password){
    const user = this;
    const isMatch = await bcrypt.compare(password, user.password);
    return isMatch;
}

//create user model
const User= mongoose.model("User", userSchema);

module.exports=User;      