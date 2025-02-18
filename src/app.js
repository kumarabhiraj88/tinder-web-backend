//import express framework
const express = require('express');
require('dotenv').config(); // Load environment variables
const connection = require('./config/database');
const User = require('./models/user');

// create an instance of express application
const app = express();
const PORT = process.env.PORT || 3000;

//signup
app.post("/signup",async(req, res)=>{
    //Creating an instance of the User model
    const user = new User({
        firstName: "Gokul",
        lastName: "",
        emailId: "gokul@gmail.com",    
        password: "Gokul@123",
        age: 36,
        gender: "Male"
    });
    try{
        await user.save();
        res.send("User created successfully");
    }catch(err){
        console.log("Error saving the user",err.message);
    }
    

})

//get all users
app.get("/getUsers", async(req, res) => {
    try{
        const result= await User.find();
        res.send(result);
    }catch(err){
        console.log("Error getting users",err.message);
    }
   
})

//get single user by id
app.get("/getUser", async(req, res) => {
    try{
        const userId=req.params.id;
        const result= await User.findById(userId);
        res.send(result);
    }catch(err){
        console.log("Error getting user",err.message);
    }
    
})

//update user
app.patch("/updateUser/:userId", async(req, res) => {
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
app.delete("/deleteUser", async(req, res) => {
    const userId=req.params.id;
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

