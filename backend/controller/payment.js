const express = require("express");
const path = require("path");
const ErrorHandler = require("../utils/ErrorHandler");
const router = express.Router();

require("dotenv").config({
  path: path.join(__dirname, "../config/.env"),
});

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey ? require("stripe")(stripeSecretKey) : null;

router.post("/process", async (req, res, next) => {
  try {
    if (!stripe) {
      return next(new ErrorHandler("Stripe secret key is missing. Add STRIPE_SECRET_KEY in backend/config/.env", 500));
    }

    const myPayment = await stripe.paymentIntents.create({
      amount: req.body.amount,
      currency: "usd",
      metadata: {
        company: "MultiVendor Ecommerce",
      },
    });

    res.status(200).json({
      success: true,
      client_secret: myPayment.client_secret,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

router.get("/stripeapikey", async(req,res,next)=>{
    try{
        res.status(200).json({
            stripeApiKey: process.env.STRIPE_API_KEY,
        });
    }catch(error){
        return next(new ErrorHandler(error.message, 500));
    }
});

module.exports=router;