const mongoose= require("mongoose");

const orderSchema = new mongoose.Schema({
    cart:{
        type:Array,
        required:true,
    },
    shippingAddress:{
        type:Object,
        required:true,
    },
    user:{
        type:Object,
        required:true,
    },
    totalPrice:{
        type:Number,
        required:true,
    },
    status:{
        type:String,
        default:"Processing",
    },
    paymentInfo:{
        id:{
            type:String,
        },
        status:{
            type:String,
        },
        type:{
            type:String,
        },
    },
    paidAt:{
        type:Date,
        default:Date.now(),
    },
    deliverAt:{
        type:Date,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
    }
});

const Order= mongoose.model("order", orderSchema);
module.exports=Order;