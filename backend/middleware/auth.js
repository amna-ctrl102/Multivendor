// const catchAsyncErrors= require("./catchAsyncErrors");
const ErrorHandler= require("../utils/ErrorHandler");
const jwt= require("jsonwebtoken");
const User= require("../model/user");
const Shop = require("../model/shop");

exports.isAuthenticated=async(req,res,next)=>{
    try{
        const {token}=req.cookies;

        if(!token){
            return next(new ErrorHandler("Please login to continue",401));
        }

        const decoded= jwt.verify(token,process.env.JWT_SECRET_KEY);
        req.user= await User.findById(decoded.id);
        next();

    }catch(error){
        return next(new ErrorHandler(error.message,500));
    }
}

exports.isSeller=async(req,res,next)=>{
    try{
        const {seller_token}=req.cookies;

        if(!seller_token){
            return next(new ErrorHandler("Please login to continue",401));
        }

        const decoded= jwt.verify(seller_token,process.env.JWT_SECRET_KEY);
        req.seller= await Shop.findById(decoded.id);
        next();

    }catch(error){
        return next(new ErrorHandler(error.message,500));
    }
}