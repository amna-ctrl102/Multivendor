const express = require("express");
const router = express.Router();
const ErrorHandler = require("../utils/ErrorHandler");
const Order = require("../model/order");
const Product = require("../model/product");
const { isAuthenticated, isSeller } = require("../middleware/auth");
const Event = require("../model/event");

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

    res.status(201).json({
      success: true,
      message: "Order Successfull!",
      orders,
    });
  } catch (error) {
    return next(new ErrorHandler(error, 500));
  }
});

// get all orders of an user
router.get("/get-all-orders/:userId", async (req, res, next) => {
  try {
    const orders = await Order.find({ "user._id": req.params.userId }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    return next(new ErrorHandler(error, 500));
  }
});

// get all orders of a specific shop
router.get("/get-seller-all-orders/:shopId", async (req, res, next) => {
  try {
    const orders = await Order.find({ "cart.shopId": req.params.shopId }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    return next(new ErrorHandler(error, 500));
  }
});

// update order status for seller
router.put("/update-order-status/:id", isSeller, async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return next(new ErrorHandler("Order is not found with this id", 400));
    }

    const status = req.body.status;

    if (
      status === "Transferred to delivery partner" ||
      status === "Delivered" ||
      status === "Shipping" ||
      status === "Received" ||
      status === "On the way"
    ) {
      for (const item of order.cart) {
        const product = await Product.findById(item._id);
        if (product) {
          product.stock = Math.max(product.stock - item.qty, 0);
          product.sold_out = (product.sold_out || 0) + item.qty;

          await product.save({ validateBeforeSave: false });
          continue;
        }

        const event = await Event.findById(item._id);
        if (event) {
          event.stock = Math.max(event.stock - item.qty, 0);
          event.sold_out = (event.sold_out || 0) + item.qty;

          await event.save({ validateBeforeSave: false });

          continue;
        }

        return next(
          new ErrorHandler(`Product not found with this id: ${item._id}`, 400),
        );
      }
    }

    order.status = status;

    if (status === "Delivered") {
      order.deliveredAt = Date.now();
      if (order.paymentInfo) {
        order.paymentInfo.status = "succeeded";
      }
    }

    await order.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: "Order status updated successfully!",
      order,
    });
  } catch (error) {
    return next(new ErrorHandler(error, 500));
  }
});

// give a refund----- this is for user
router.put("/order-refund/:id", async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return next(new ErrorHandler("Order is not found with this id", 400));
    }

    const status = req.body.status;
    order.status = status;

    await order.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: "Order refund request successfully!",
      order,
    });
  } catch (error) {
    return next(new ErrorHandler(error, 500));
  }
});

// accept refund----- this is for seller
router.put("/order-refund-success/:id", isSeller, async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return next(new ErrorHandler("Order is not found with this id", 400));
    }

    const status = req.body.status;

    if (status === "Refund Success" && order.status !== "Refund Success") {
      for (const item of order.cart) {
        const product = await Product.findById(item._id);

        if (product) {
          product.stock = Math.max(product.stock + item.qty, 0);
          product.sold_out = Math.max(product.sold_out || 0) - item.qty;

          await product.save({ validateBeforeSave: false });
          continue;
        }
        const event = await Event.findById(item._id);
        if (event) {
          event.stock = Math.max(event.stock + item.qty, 0);
          event.sold_out = Math.max(event.sold_out || 0) - item.qty;

          await event.save({ validateBeforeSave: false });
          continue;
        }

        return next(
          new ErrorHandler(`Product not found with this id: ${item._id}`, 400),
        );
      }
    }

    order.status = status;

    await order.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: "Order refund successfull!",
      order,
    });
  } catch (error) {
    return next(new ErrorHandler(error, 500));
  }
});

module.exports = router;
