const express = require("express");
const router = express.Router();
const Product = require("../model/product");
const Order = require("../model/order");
const { upload } = require("../multer");
const ErrorHandler = require("../utils/ErrorHandler");
const Shop = require("../model/shop");
const { isSeller, isAuthenticated } = require("../middleware/auth");
const fs = require("fs");

router.post(
  "/create-product",
  upload.array("images"),
  async (req, res, next) => {
    try {
      const shopId = req.body.shopId;
      const shop = await Shop.findById(shopId);

      if (!shop) {
        return next(new ErrorHandler("Shop Id is invalid!", 400));
      } else {
        const files = req.files;
        const imageUrls = files.map((file) => `uploads/${file.filename}`);
        const productData = req.body;
        productData.images = imageUrls;
        productData.shop = shop;

        const product = await Product.create(productData);
        res.status(201).json({
          success: true,
          product,
        });
      }
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  },
);

// get all products of a specific shop
router.get("/get-all-products-shop/:id", async (req, res, next) => {
  try {
    const products = await Product.find({ shopId: req.params.id });

    res.status(201).json({
      success: true,
      products,
    });
  } catch (error) {
    return next(new ErrorHandler(error, 404));
  }
});

// delete product of a shop
router.delete("/delete-shop-product/:id", isSeller, async (req, res, next) => {
  try {
    const productId = req.params.id;
    const productData = await Product.findById(productId);

    productData.images.forEach((imageUrl) => {
      const filename = imageUrl;
      const filePath = `${filename}`;
      fs.unlink(filePath, (err) => {
        if (err) console.log(err);
      });
    });

    const product = await Product.findByIdAndDelete(productId);
    if (!product) {
      return next(new ErrorHandler("Product is not found with this Id!", 404));
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
});

// get products of all shops
router.get("/get-all-products", async (req, res, next) => {
  try {
    const allProducts = await Product.find();
    res.status(200).json({
      success: true,
      allProducts,
    });
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
});

// review for a product
router.put(
  "/create-new-review",
  isAuthenticated,
  async (req, res, next) => {
    try {
      const { user, rating, comment, productId, orderId } = req.body;

      const product = await Product.findById(productId);

      if (!product) {
        return next(new ErrorHandler("Product not found", 404));
      }

      const review = {
        user,
        rating,
        comment,
        productId,
        orderId,
      };

      // Check if current user has already reviewed this product
      const existingReview = product.reviews.find(
        (rev) => String(rev.user._id) === String(req.user._id)
      );

      if (existingReview) {
        // Update existing review
        existingReview.rating = rating;
        existingReview.comment = comment;
        existingReview.user = user;
      } else {
        // Add new review
        product.reviews.push(review);
      }

      // Calculate average rating
      let totalRating = 0;

      product.reviews.forEach((rev) => {
        totalRating += Number(rev.rating);
      });

      product.ratings =
        product.reviews.length > 0
          ? totalRating / product.reviews.length
          : 0;

      await product.save({ validateBeforeSave: false });

      await Order.findByIdAndUpdate(
        orderId,
        { $set: { "cart.$[elem].isReviewed": true } },
        { arrayFilters: [{ "elem._id": productId }], returnDocument: "after" }
      );

      res.status(200).json({
        success: true,
        message:"Review added successfully",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

module.exports = router;
