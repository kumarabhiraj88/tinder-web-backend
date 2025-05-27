//import express framework
const express = require('express');
require('dotenv').config(); // Load environment variables
const connection = require('./config/database');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const authRouter = require('./routes/authRouter');
const profileRouter = require('./routes/profileRouter');
const userRouter = require('./routes/userRouter');
const requestRouter = require('./routes/requestRouter');

// create an instance of express application
const app = express();
const PORT = process.env.PORT || 3000;

//allowed origins
const allowedOrigins = ["http://localhost:5173"];

//whitelist the domains that can access the backend
app.use(cors({
    origin: function(origin, callback){
        // Allow requests with no origin (e.g. mobile apps or curl requests)
        if (!origin) return callback(null, true);

        //origin - is the domain from which the request originated
        if(allowedOrigins.includes(origin)){
            callback(null, true);
        }
        else{
            callback(new Error("Not allowed by CORS"));
        }
    },
    //Purpose: Tells the browser to include credentials (like cookies, Authorization headers, etc.) with requests.
    credentials: true
}))
//converts the JSON data in the request body into a JavaScript object
app.use(express.json());

//parse cookies attached to incoming requests
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/user", userRouter);
app.use("/request", requestRouter);

//server start listening on port only if database connected successfully
connection().then(()=>{
    console.log('Connected to database');
    app.listen(PORT, () => {
        console.log(`Example app listening on port ${PORT}`);
    })
}).catch(err=>console.log('DB Connection error', err));

