const express = require('express');
const userRouter = express.Router();
const User = require('../models/user');
const userAuth = require('../middlewares/auth');

//get all users
userRouter.get("/getUsers", userAuth,  async(req, res) => {
    try{
        const result= await User.find();
        res.send(result);
    }catch(err){
        console.log("Error getting users",err.message);
    }
   
})

//get single user by id
userRouter.get("/getUser", userAuth, async(req, res) => {
    try{
        const userId=req.params.id;
        const result= await User.findById(userId);
        res.send(result);
    }catch(err){
        console.log("Error getting user",err.message);
    }
    
})



//update user
userRouter.patch("/updateUser/:userId", userAuth, async(req, res) => {
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
userRouter.delete("/deleteUser/:userId", userAuth, async(req, res) => {
    const userId=req.params.userId;
    try{
        //findByIdAndDelete(id) is a shorthand for findOneAndDelete({ _id: id })
        await User.findByIdAndDelete(userId);
        res.send("User deleted successfully");
    }catch(err){    
        console.log("Error deleting user",err.message);
    } 
})


module.exports=userRouter;