const express = require('express');
const userAuth = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');

const requestRouter = express.Router();

//corner cases
//1-> can send "accepted" or "rejected" status through the params- status in the api
//2-> check whether the receiverId exists or not
//3-> don't allow the user to send more than one request to the same user
requestRouter.post("/send/:status/:receiverId", userAuth, async(req, res) => {
    try{
        const senderId = req.user._id;
        const {status, receiverId} =req.params;

        //corner case 1
        const allowedStatus= ["ignored", "interested"];
        if(!allowedStatus.includes(status)){
           return res.status(400).json({message:"Invalid status type: "+status});
        }

        //corner case 2
        const receiverExists= await User.findById(receiverId);
        if(!receiverExists){
            return res.status(404).json({message:"Receiver not found"});
        }

        //corner case 3
        const existingRequest= await ConnectionRequest.findOne({
            $or:[
                {senderId, receiverId},   //{senderId:senderId, receiverId:receiverId}, - this is also valid
                {senderId:receiverId, receiverId:senderId},
            ]
        });
        if(existingRequest){
            return res.status(400).json({message:"Connection request already exists"});
        }

        const connectionRequest= new ConnectionRequest({
            senderId,
            receiverId,
            status
        });
        await connectionRequest.save();
        
        res.send("Request sent successfully");
    }catch(err){    
        console.log("Error sending request",err.message);
    } 
})  

module.exports=requestRouter;