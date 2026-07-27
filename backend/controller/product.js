const express = require("express");
const router = express.Router();
const Product = require("../model/product");
const { upload } = require("../multer");
const ErrorHandler = require("../utils/ErrorHandler");
const Shop = require("../model/shop");
const { isSeller } = require("../middleware/auth");
const fs= require("fs");

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
        const imageUrls = files.map((file) => `${file.filename}`);
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
      const filePath = `uploads/${filename}`;
      fs.unlink(filePath, (err) => {
        if (err) console.log(err);
      });
    });

    const product= await Product.findByIdAndDelete(productId);
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

module.exports = router;
