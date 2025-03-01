const validator = require("validator");

const validateSignupData = (req) => {
    const {firstName, emailId, password}=req.body;
    if(!firstName){
        throw new Error("First name is not valid");
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("Email is not valid")
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Please enter a strong password")
    }
}

const validatePofileEditData=(req)=>{
     // Check if email or password fields are present
     if (req.email || req.password) {
        throw new Error("Email and password fields are not allowed in profile updates.");
    }
}

module.exports= {validatePofileEditData, validateSignupData}; //exporting validateSignupData, validatePofileEditData;