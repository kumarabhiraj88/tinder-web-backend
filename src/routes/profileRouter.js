const express = require('express');
const profileRouter = express.Router();
const userAuth = require('../middlewares/auth');
const {validatePofileEditData} = require('../utils/validation');

//get profile
profileRouter.get("/view", userAuth,  async(req, res) => {
    try{
        const user= req.user;
        res.send(user);
    }catch(err){
        res.status(400).send("Error : "+ err.message)
    }
   
})

//edit profile
profileRouter.patch("/edit", userAuth,  async(req, res) => {
    try{
        console.log('user before validation', req);
        validatePofileEditData(req);
        console.log('user after validation', req);
        const loggedInUserData= req.user;
        Object.keys(req.body).forEach((key)=>{
            loggedInUserData[key]=req.body[key];
        })
        await loggedInUserData.save();
        res.json({message:"Profile updated successfully", data:loggedInUserData});
    }catch(err){
        res.status(400).send("Error : "+ err.message)
    }
   
})

module.exports=profileRouter;