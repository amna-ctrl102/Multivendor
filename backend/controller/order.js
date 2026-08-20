const express = require("express");
const router = express.Router();
const ErrorHandler = require("../utils/ErrorHandler");
const Order = require("../model/order");
const Product = require("../model/product");
const { isAuthenticated } = require("../middleware/auth");

// create new order
router.post("/create-order", isAuthenticated, async (req, res, next) => {
  try {
    const { cart, shippingAddress, user, totalPrice, paymentInfo } = req.body;

    // group cartItems by shopId
    const shopItemsMap = new Map();
    for (const item of cart) {
      const shopId = item.shopId;
      if (!shopItemsMap.has(shopId)) {
        shopItemsMap.set(shopId, []);
      }
      shopItemsMap.get(shopId).push(item);
    }

    // create order for each shop
    const orders = [];
    for (const [shopId, items] of shopItemsMap) {
      const order = await Order.create({
        cart: items,
        shippingAddress,
        user,
        totalPrice,
        paymentInfo,
      });
      orders.push(order);
    }

    res.status(200).json({
      success: true,
      message:"Order Successfull!",
      orders,
    });
  } catch (error) {
    return next(new ErrorHandler(error, 500));
  }
});

module.exports = router;
