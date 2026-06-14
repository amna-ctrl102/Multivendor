const express= require("express");
const app=express();
const errorMiddleware = require("./middleware/error");
const cookieParser=require("cookie-parser");
const userRouter=require("./controller/user");
const cors= require("cors");

//config
if(process.env.NODE_ENV !== "PRODUCTION"){
    require("dotenv").config({
        path:"backend/config/.env"
    })
}

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use("/uploads",express.static("uploads"));
app.use(express.urlencoded({extended:true}));

// Routes
app.use("/api/v2/user",userRouter);


// it's for Errorhandling
app.use(errorMiddleware);

module.exports=app;