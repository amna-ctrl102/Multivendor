const express = require("express");
const path = require("path");
const router = express.Router();
const { upload } = require("../multer");
const User = require("../model/user");
const ErrorHandler = require("../utils/ErrorHandler");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const sendToken = require("../utils/jwtToken");
// const catchAsyncErrors = require("../middleware/catchAsyncErrors");

router.post("/create-user", upload.single("file"), async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const userEmail = await User.findOne({ email });
    if (userEmail) {
      if (req.file) {
        const filename = req.file.filename;
        const filePath = `uploads/${filename}`;
        fs.unlink(filePath, (err) => {
          if (err) console.log(err);
        });
      }
      return next(new ErrorHandler("User already exists", 400));
    }
    const filename = req.file.filename;
    const fileUrl = path.join("uploads", filename);
    const user = {
      name,
      email,
      password,
      avatar: fileUrl,
    };
    const activationToken = createActivationToken(user);
    const activateUrl = `http://localhost:3000/activation/${activationToken}`;
    try {
      await sendMail({
        email: user.email,
        subject: "Activate your account",
        message: `Hello ${user.name}, please click on the link to activate your account: ${activateUrl}`,
      });
      res.status(201).json({
        success: true,
        message: `please check your email:- ${user.email} to activate your account!`,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// create activation token
const createActivationToken = (user) => {
  return jwt.sign(user, process.env.ACTIVATION_SECRET, {
    expiresIn: "5m",
  });
};

// activate user
router.post(
  "/activation",(async (req, res, next) => {
    try {
      const { activation_token } = req.body;

      const newUser = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET,
      );

      if (!newUser) {
        return next(new ErrorHandler("Invalid token", 400));
      }

      const { name, email, password, avatar } = newUser;

      let user = await User.findOne({ email });
      if (user) {
        return next(new ErrorHandler("User already exits",400));
      }
      user=await User.create({
        name,
        email,
        password,
        avatar,
      });
      sendToken(user, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }),
);

// Login user
router.post("/login-user",async(req,res,next)=>{
    try{
        const {email,password}=req.body;
        if(!email || !password){
            return next(new ErrorHandler("Please provide the all fields",400));
        }
        const user=await User.findOne({email}).select("+password");

        if(!user){
            return next(new ErrorHandler("User doesn't exists",400));
        }
        
        const isPasswordValid= await user.comparePassword(password);

        if(!isPasswordValid){
            return next(new ErrorHandler("Please provide correct information",400));
        }

        sendToken(user,201,res);

    }catch(error){
        return next(new ErrorHandler(error.message,500));
    }
})

module.exports = router;
