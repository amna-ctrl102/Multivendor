const express = require("express");
const path = require("path");
const router = express.Router();
const { upload } = require("../multer");
const User = require("../model/user");
const ErrorHandler = require("../utils/ErrorHandler");
const fs= require("fs");

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

        const newUser = await User.create(user);
        res.status(201).json({
        success: true,
        newUser,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
});

module.exports = router;
