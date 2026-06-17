// const catchAsyncErrors= require("./catchAsyncErrors");
const ErrorHandler= require("../utils/ErrorHandler");
const jwt= require("jsonwebtoken");
const User= require("../model/user");

exports.isAuthenticated=async(req,res,next)=>{
    try{
        const {token}=req.cookies;

        if(!token){
            return next(new ErrorHandler("Please login to continue",401));
        }

        const decoded= jwt.verify(token,process.env.JWT_SECRET_KEY);
        req.user= await User.findById(decoded.id);

    }catch(error){
        return next(new ErrorHandler(error.message,500));
    }
}