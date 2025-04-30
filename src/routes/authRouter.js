const express = require('express');
const authRouter = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const {validateSignupData} = require('../utils/validation');

//signup
authRouter.post("/signup",async(req, res)=>{
  
    try{
         validateSignupData(req);

        const {firstName, lastName, emailId, password, age, gender, photoUrl, about}=req.body;

        //encrypt the password
        const passwordHash=await bcrypt.hash(password,10);

        //Creating an instance of the User model
        const user = new User({
            firstName,
            lastName,
            emailId, 
            password: passwordHash,
            age,
            gender,
            photoUrl,
            about,
        });
        const savedUser=await user.save();
        //keep the created user as loggedin user
        const token = await savedUser.getJWT();
        res.cookie("token", token);
        res.json({message:"User created successfully", data:user});

    }catch(err){
        res.status(400).send("Error : "+ err.message)
    }  

})

//login
authRouter.post("/login",async(req, res)=>{
    try{        
        const {emailId, password}=req.body;
        const user=await User.findOne({emailId});
        if(!user){  
            throw new Error("Invalid credentials");
        }       
        else{
            //validate password using schema methods
            const isMatch=await user.validatePassword(password);
            if(!isMatch){
                throw new Error("Invalid credentials");
            }           
            else{
                //get the token from user instance using schema method and attach this token to res.cookie()
                const token = await user.getJWT();
                res.cookie("token", token);
                res.send(user);
            }
        }
    }catch(err){
        res.status(400).send("Error : "+ err.message)
    }   
 })


 authRouter.post("/logout", async(req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now())
    });
    res.send("Logged out successfully");
})


 module.exports=authRouter;