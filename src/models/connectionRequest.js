const mongoose = require('mongoose');

const connectionRequestSchema = mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status:{
        type: String,
        required: true,
        enum: {
            values:['ignored', 'interested', 'accepted', 'rejected'],
            message: '{VALUE} is incorrect status type'
        },
    }
}, {
    timestamps: true
});

//create compound index (1- ascending order)
connectionRequestSchema.index({senderId: 1, receiverId: 1});

//always use normal function here instead of arrow function
//this will get triggered before save event occurs
connectionRequestSchema.pre("save", function(next) {
   const connectionRequest =this;

    //check whether the senderId and receiverId are same
    if(connectionRequest.senderId.equals(connectionRequest.receiverId)){
        throw new Error("Sender and receiver cannot be same");
    }
    next();
});

//create connectionRequest model
const ConnectionRequest= mongoose.model("ConnectionRequest", connectionRequestSchema);

module.exports = ConnectionRequest;