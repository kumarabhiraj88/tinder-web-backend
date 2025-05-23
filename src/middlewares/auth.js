const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth =async(req, res, next) => {
    //checking whether the req contains a valid token or not
    try{
        //read the token from req
        const {token}= req.cookies;

        if(!token){
            return res.status(401).json({error:"Please login"});
        }
        //The jwt.verify() function from the jsonwebtoken library is synchronous by default. 
        // It does not return a promise — so using await has no effect, which triggers the warning.
        const decodedObject = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const {_id}=decodedObject;
        const user= await User.findById(_id);
        if(!user){
            throw new Error("User not found");   
        }
        //attach the valid user data to req, to avoid refetching user data from database every time
        req.user=user;
        next();
    }catch(err){
        return res.status(400).json({error:err.message || "Auth Error"});
    }
    
}

module.exports=userAuth;