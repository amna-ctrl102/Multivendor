const express= require("express");
const app=express();
const errorMiddleware = require("./middleware/error");
const cookieParser=require("cookie-parser");
const userRouter=require("./controller/user");
const shopRouter=require("./controller/shop");
const productRouter=require("./controller/product");
const eventRouter=require("./controller/event");
const coupounRouter=require("./controller/coupounCode");
const paymentRouter=require("./controller/payment");
const orderRouter=require("./controller/order");
const cors= require("cors");

//config
if(process.env.NODE_ENV !== "PRODUCTION"){
    require("dotenv").config({
        path: `${__dirname}/config/.env`
    })
}
 
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads",express.static("uploads"));
app.use(express.urlencoded({extended:true}));

// Routes
app.use("/api/v2/user",userRouter);
app.use("/api/v2/shop",shopRouter);
app.use("/api/v2/product",productRouter);
app.use("/api/v2/event",eventRouter);
app.use("/api/v2/coupoun",coupounRouter);
app.use("/api/v2/payment",paymentRouter);
app.use("/api/v2/order",orderRouter);

// it's for Errorhandling
app.use(errorMiddleware);

module.exports=app;