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
const { isAuthenticated } = require("../middleware/auth");

router.post("/create-user", upload.single("file"), async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const userInfo = await User.findOne({ email });
    if (userInfo) {
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
    return next(new ErrorHandler(error.message, 500));
  }
});

// create activation token
const createActivationToken = (user) => {
  return jwt.sign(user, process.env.ACTIVATION_SECRET, {
    expiresIn: "5m",
  });
};

// activate user
router.post("/activation", async (req, res, next) => {
  try {
    const { activation_token } = req.body;

    const newUser = jwt.verify(activation_token, process.env.ACTIVATION_SECRET);

    if (!newUser) {
      return next(new ErrorHandler("Invalid token", 400));
    }

    const { name, email, password, avatar } = newUser;

    let user = await User.findOne({ email });
    if (user) {
      return next(new ErrorHandler("User already exits", 400));
    }
    user = await User.create({
      name,
      email,
      password,
      avatar,
    });
    sendToken(user, 201, res);
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Login user
router.post("/login-user", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new ErrorHandler("Please provide the all fields", 400));
    }
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorHandler("User doesn't exists", 400));
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return next(new ErrorHandler("Please provide correct information", 400));
    }

    sendToken(user, 201, res);
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

//load user
router.get("/getuser", isAuthenticated, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return next(new ErrorHandler("User doesn't exists", 400));
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

router.get("/logout", isAuthenticated, async (req, res, next) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      message: "Log out Successfull!",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// update user information
router.put("/update-user-info", isAuthenticated, async (req, res, next) => {
  try {
    const { name, email, password, phoneNumber } = req.body;
    const user = await User.findById(req.user._id).select("+password");

    if (!user) {
      return next(new ErrorHandler("User doesn't exists", 400));
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return next(new ErrorHandler("Please provide correct information", 400));
    }

    user.name = name;
    user.email = email;
    user.phoneNumber = phoneNumber;

    await user.save();
    res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// update user avatar
router.put(
  "/update-avatar",
  isAuthenticated,
  upload.single("image"),
  async (req, res, next) => {
    try {
      const existUser = await User.findById(req.user._id);
      if (!existUser) {
        return next(new ErrorHandler("User doesn't exist", 400));
      }

      if (!req.file) {
        return next(new ErrorHandler("Please upload an image", 400));
      }

      const existAvatarPath = existUser.avatar;

      fs.unlink(existAvatarPath, (err) => {
        if (err) console.log(err);
      });

      const filename = req.file.filename;
      const fileUrl = path.join("uploads", filename);

      const user = await User.findByIdAndUpdate(
        req.user._id,
        {
          avatar: fileUrl,
        },
        {
          returnDocument: "after",
        },
      );

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
);

// update user addresses
router.put(
  "/update-user-addresses",
  isAuthenticated,
  async (req, res, next) => {
    try {
      const user = await User.findById(req.user._id);

      const sameAddressType = user.addresses.find(
        (address) => address.addressType === req.body.addressType,
      );

      if (sameAddressType) {
        return next(
          new ErrorHandler(
            `${req.body.addressType} address already exists`,
            400,
          ),
        );
      }

      user.addresses.push(req.body);

      await user.save();

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
);

// delete user address
router.delete(
  "/delete-user-address/:id",
  isAuthenticated,
  async (req, res, next) => {
    try {
      const userId = req.user._id;
      const addressId = req.params.id;

      await User.updateOne(
        {
          _id: userId,
        },
        {
          $pull: { addresses: { _id: addressId } },
        },
      );

      const user = await User.findById(userId);
      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
);

// upadate user password
router.put("/update-password", isAuthenticated, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("+password");

    const isPassword = await user.comparePassword(req.body.oldPassword);
    if (!isPassword) {
      return next(new ErrorHandler("Old password is incorrect!", 404));
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
      return next(
        new ErrorHandler("Password doesn't match with each other", 404),
      );
    }

    user.password = req.body.newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully!",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

router.get("/user-info/:id", async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

module.exports = router;
