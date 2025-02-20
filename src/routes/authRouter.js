const express = require('express');
const authRouter = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validateSignupData = require('../utils/validation');

//signup
authRouter.post("/signup",async(req, res)=>{
  
    try{
         validateSignupData(req);

        const {firstName, lastName, emailId, password, age, gender}=req.body;

        //encrypt the password
        const passwordHash=await bcrypt.hash(password,10);

        //Creating an instance of the User model
        const user = new User({
            firstName,
            lastName,
            emailId, 
            password: passwordHash,
            age,
            gender
        });
        await user.save();
        res.send("User created successfully");
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
            const isMatch=await bcrypt.compare(password, user.password);
            if(!isMatch){
                throw new Error("Invalid credentials");
            }           
            else{
                //create a JWT token and add it to cookies
                const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET_KEY);
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