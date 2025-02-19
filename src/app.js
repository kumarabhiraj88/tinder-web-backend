//import express framework
const express = require('express');
require('dotenv').config(); // Load environment variables
const connection = require('./config/database');
const User = require('./models/user');
const validateSignupData = require('./utils/validation');
const bcrypt=require('bcrypt');
const cookieParser = require('cookie-parser');
const userAuth = require('./middlewares/auth');
const cors = require('cors');
const jwt = require('jsonwebtoken');

// create an instance of express application
const app = express();
const PORT = process.env.PORT || 3000;

//whitelist the domains that can access the backend
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
//converts the JSON data in the request body into a JavaScript object
app.use(express.json());

//parse cookies attached to incoming requests
app.use(cookieParser());

//signup
app.post("/signup",async(req, res)=>{
  
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
        console.log("Error saving the user",err.message);
    }  

})

//login
app.post("/login",async(req, res)=>{
    try{        
        const {emailId, password}=req.body;
        const user=await User.findOne({emailId});
        if(!user){  
            res.send("Invalid credentials");
        }       
        else{
            const isMatch=await bcrypt.compare(password, user.password);
            if(!isMatch){
                res.send("Invalid credentials");
            }           
            else{
                //create a JWT token and add it to cookies
                const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET_KEY);
                res.cookie("token", token);
                res.send("Login successful");
            }
        }
    }catch(err){
        console.log("Error logging in",err.message);
    }   
 })

//get all users
app.get("/getUsers", userAuth,  async(req, res) => {
    try{
        const result= await User.find();
        res.send(result);
    }catch(err){
        console.log("Error getting users",err.message);
    }
   
})

//get single user by id
app.get("/getUser", userAuth, async(req, res) => {
    try{
        const userId=req.params.id;
        const result= await User.findById(userId);
        res.send(result);
    }catch(err){
        console.log("Error getting user",err.message);
    }
    
})

//update user
app.patch("/updateUser/:userId", userAuth, async(req, res) => {
    const userId=req.params?.userId;
    const {firstName, lastName, age, gender}=req.body;
    const updateData={
        firstName: firstName,
        lastName: lastName,
        age: age,
        gender: gender
    };
    try{
        await User.findByIdAndUpdate(userId, updateData);
        //there is an optional third argument for { returnDocument: "after"} or { returnDocument: "before"}
        res.send("User updated successfully");
    }catch(err){
        console.log("Error updating user",err.message);
    }
})

//delete user
app.delete("/deleteUser/:userId", userAuth, async(req, res) => {
    const userId=req.params.userId;
    try{
        //findByIdAndDelete(id) is a shorthand for findOneAndDelete({ _id: id })
        await User.findByIdAndDelete(userId);
        res.send("User deleted successfully");
    }catch(err){    
        console.log("Error deleting user",err.message);
    } 
})



//server start listening on port only if database connected successfully
connection().then(()=>{
    console.log('Connected to database');
    app.listen(PORT, () => {
        console.log(`Example app listening on port ${PORT}`);
    })
}).catch(err=>console.log('DB Connection error', err));

