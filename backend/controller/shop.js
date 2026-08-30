const express = require("express");
const router = express.Router();
const { upload } = require("../multer");
const Shop = require("../model/shop");
const Product = require("../model/product");
const Event = require("../model/event");
const ErrorHandler = require("../utils/ErrorHandler");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const sendShopToken = require("../utils/shopToken");
const { isSeller } = require("../middleware/auth");

router.post("/create-shop", upload.single("file"), async (req, res, next) => {
  try {
    const { email, name, password, address, phoneNumber, zipCode } = req.body;

    // Check if shop already exists
    const sellerInfo = await Shop.findOne({ email });

    if (sellerInfo) {
      return next(new ErrorHandler("Shop already exists", 400));
    }

    // Check image
    if (!req.file) {
      return next(new ErrorHandler("Please upload a shop image", 400));
    }

    // Cloudinary image URL
    const fileUrl = req.file.path;

    const seller = {
      name,
      email,
      password,
      avatar: fileUrl,
      address,
      phoneNumber,
      zipCode,
    };

    // Create activation token
    const activationToken = createActivationToken(seller);

    const activateUrl = `https://multivendor-frontend-amber.vercel.app/seller/activation/${activationToken}`;

    try {
      await sendMail({
        email: seller.email,
        subject: "Activate your shop",
        message: `Hello ${seller.name}, please click on the link to activate your shop: ${activateUrl}`,
      });

      res.status(201).json({
        success: true,
        message: `Please check your email:- ${seller.email} to activate your shop!`,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// create activation token
const createActivationToken = (seller) => {
  return jwt.sign(seller, process.env.ACTIVATION_SECRET, {
    expiresIn: "5m",
  });
};

router.post("/activation", async (req, res, next) => {
  try {
    const { activation_token } = req.body;

    const newSeller = jwt.verify(
      activation_token,
      process.env.ACTIVATION_SECRET,
    );

    if (!newSeller) {
      return next(new ErrorHandler("Invalid token", 400));
    }

    const { name, email, password, avatar, address, phoneNumber, zipCode } =
      newSeller;

    let seller = await Shop.findOne({ email });
    if (seller) {
      return next(new ErrorHandler("User already exits", 400));
    }
    seller = await Shop.create({
      name,
      email,
      password,
      avatar,
      address,
      phoneNumber,
      zipCode,
    });
    sendShopToken(seller, 201, res);
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Login shop
router.post("/login-shop", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new ErrorHandler("Please provide the all fields", 400));
    }
    const seller = await Shop.findOne({ email }).select("+password");

    if (!seller) {
      return next(new ErrorHandler("User doesn't exists", 400));
    }

    const isPasswordValid = await seller.comparePassword(password);

    if (!isPasswordValid) {
      return next(new ErrorHandler("Please provide correct information", 400));
    }

    sendShopToken(seller, 201, res);
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

router.get("/getSeller", isSeller, async (req, res, next) => {
  try {
    const seller = await Shop.findById(req.seller._id);

    if (!seller) {
      return next(new ErrorHandler("User doesn't exists", 400));
    }

    res.status(200).json({
      success: true,
      seller,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

router.get("/logout", isSeller, async (req, res, next) => {
  try {
    res.cookie("seller_token", null, {
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

// get shop info
router.get("/get-shop-info/:id", async (req, res, next) => {
  try {
    const shop = await Shop.findById(req.params.id);
    res.status(200).json({
      success: true,
      shop,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// update shop avatar
router.put(
  "/update-shop-avatar",
  isSeller,
  upload.single("image"),
  async (req, res, next) => {
    try {
      const existShop = await Shop.findById(req.seller._id);

      if (!existShop) {
        return next(new ErrorHandler("Shop doesn't exist", 400));
      }

      if (!req.file) {
        return next(new ErrorHandler("Please upload an image", 400));
      }

      // Cloudinary URL
      const fileUrl = req.file.path;

      // Update shop avatar
      const shop = await Shop.findByIdAndUpdate(
        req.seller._id,
        {
          avatar: fileUrl,
        },
        {
          new: true,
        },
      );

      // Update shop avatar inside all products
      await Product.updateMany(
        { "shop._id": shop._id },
        {
          $set: {
            "shop.avatar": shop.avatar,
          },
        },
      );

      // Update shop avatar inside all events
      await Event.updateMany(
        { "shop._id": shop._id },
        {
          $set: {
            "shop.avatar": shop.avatar,
          },
        },
      );

      res.status(200).json({
        success: true,
        shop,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
);
// update seller info
router.put("/update-shop-info", isSeller, async (req, res, next) => {
  try {
    const { name, description, address, phoneNumber, zipCode } = req.body;
    const shop = await Shop.findById(req.seller._id);

    if (!shop) {
      return next(new ErrorHandler("User doesn't exists", 400));
    }

    shop.name = name;
    shop.description = description;
    shop.phoneNumber = phoneNumber;
    shop.address = address;
    shop.zipCode = zipCode;

    await shop.save();

    await Product.updateMany(
      { "shop._id": shop._id },
      {
        $set: {
          "shop.name": shop.name,
          "shop.description": shop.description,
          "shop.address": shop.address,
          "shop.phoneNumber": shop.phoneNumber,
          "shop.zipCode": shop.zipCode,
        },
      },
    );

    await Event.updateMany(
      { "shop._id": shop._id },
      {
        $set: {
          "shop.name": shop.name,
          "shop.description": shop.description,
          "shop.address": shop.address,
          "shop.phoneNumber": shop.phoneNumber,
          "shop.zipCode": shop.zipCode,
        },
      },
    );

    res.status(200).json({
      success: true,
      message: "Shop info updated successfully!",
      shop,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

module.exports = router;
