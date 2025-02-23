const express = require('express');
const userRouter = express.Router();
const User = require('../models/user');
const userAuth = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');


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

//corner cases
//User Should see all the profiles except
//1->  his own card
//2->  his connections
//3->  ignored profiles
//4->  Already connected profiles

userRouter.get("/feed", userAuth, async(req, res) => {
    try{    
        const loggedInUser= req.user._id;
        const page = parseInt(req.params.page) || 1;
        let limit = parseInt(req.params.limit) || 10;
        limit = limit > 50 ? 50: limit;  //to prevent more than 50 results
        const skip = (page - 1) * limit; //ie, skipping previous pages result

        //Find all the connection requests(sent/received) of the logged in user  -- to avoid from the feed api
        const connectionRequests= await ConnectionRequest.find({
            $or:[
                {senderId:loggedInUser},
                {receiverId:loggedInUser}
            ]
        }).select("senderId receiverId");

        //get unique user ids from the connection requests
        const uniqueUserIds= new Set();
       
        connectionRequests.forEach(request=>{
            uniqueUserIds.add(request.senderId.toString());
            uniqueUserIds.add(request.receiverId.toString());
        });

        // Convert the Set to an array for querying
        const userIdsArray = Array.from(uniqueUserIds); //this is my connection users

        //find the profiles except uniqueUserIds and my own id (need the profiles which are not in my connections)
        const feed= await User.find({
            $and:[
                { _id:{ $nin: userIdsArray } }, //not in
                { _id:{ $ne: loggedInUser }} //not equal
            ]
        }).select("firstName lastName age gender").skip(skip).limit(limit);

        res.send(feed);
        
    }catch(err){    
        console.log("Error getting feed",err.message);
    } 
})


module.exports=userRouter;