const express = require('express');
const authRouter = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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
        const accessToken = await savedUser.getJWT();
        res.cookie("accessToken", accessToken, {httpOnly: true, secure: false});
        res.json({message:"User created successfully", data:user});

    }catch(err){
        res.status(401).send("Error : "+ err.message)
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
                //If you're testing locally without HTTPS, you must set secure: false, or the browser won’t send the cookie at all.
                const accessToken  = await user.getJWT();
                res.cookie("accessToken", accessToken, {httpOnly: true, secure: false});

                const refreshToken  = await user.getRefreshJWT();
                res.cookie("refreshToken", refreshToken, {httpOnly: true, secure: false});

                //The httpOnly: true option tells the browser:
                //Only send this cookie with HTTP(S) requests — do not make it accessible to JavaScript running in the browser 
                // (e.g. via document.cookie)-- console.log(document.cookie); // Can see all cookies not marked httpOnly
                //without httpOnly: true,  it could be stolen and used by an attacker.
                res.send(user);
            }
        }
    }catch(err){
        res.status(401).send("Error : "+ err.message)
    }   
 })


authRouter.post("/refresh-token", async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken || req.body.token;

    if (!refreshToken) {
      return res.status(401).json({ error: "No refresh token provided" });
    }

    // Verify the refresh token using REFRESH secret
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET_KEY);
    const userId = decoded._id;

    // Create new access token using ACCESS secret
    const newAccessToken = jwt.sign(
      { _id: userId },
      process.env.JWT_SECRET_KEY,
      { expiresIn: process.env.JWT_EXPIRE } 
    );

    // Send new access token in cookie AND response
    res.cookie("accessToken", newAccessToken, { httpOnly: true, secure: false });

    res.status(200).json({ accessToken: newAccessToken }); // ✅ Frontend expects this
  } catch (err) {
    console.error("Refresh token error:", err.message);
    res.status(401).send("Error: " + err.message);
  }
});



 authRouter.post("/logout", async(req, res) => {
    res.cookie("accessToken", null, {
        expires: new Date(Date.now())
    });
    res.send("Logged out successfully");
})


 module.exports=authRouter;