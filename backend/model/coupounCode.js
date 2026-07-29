const mongoose=require("mongoose");

const coupounCodeSchema= new mongoose.Schema({
    name:{
        type:String,
        required:[true, "Please enter your coupoun code name!"],
        unique:true,
    },
    value:{
        type:Number,
        required: true,
    },
    minAmount:{
        type:Number,
    },
    maxAmount:{
        type:Number,
    },
    selectedProducts:{
        type: String,
    },
    shop:{
        type: Object,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
    },
});

const CoupounCode=mongoose.model("CoupounCode", coupounCodeSchema);
module.exports=CoupounCode;