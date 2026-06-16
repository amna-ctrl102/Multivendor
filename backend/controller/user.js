const express = require("express");
const path = require("path");
const router = express.Router();
const { upload } = require("../multer");
const User = require("../model/user");
const ErrorHandler = require("../utils/ErrorHandler");
const fs= require("fs");
const jwt= require("jsonwebtoken");
const sendMail = require("../utils/sendMail");

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
const createActivationToken=(user)=>{
    return jwt.sign(user, process.env.ACTIVATION_SECRET,{
        expiresIn: "5m",
    });
}


module.exports = router;
