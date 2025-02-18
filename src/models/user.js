const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
    },
    lastName:{
        type: String,
    },
    emailId:{
        type: String,
    },
    password: {
        type: String,
    },
    age:{
        type: Number
    },
    gender:{
        type: String
    }
});

//create user model
const User= mongoose.model("User", userSchema);

module.exports=User;      