const express = require("express");
const router = express.Router();
const ErrorHandler = require("../utils/ErrorHandler");
const Shop = require("../model/shop");
const { isSeller } = require("../middleware/auth");
const CoupounCode = require("../model/coupounCode");

// Create coupoun code
router.post("/create-coupoun-code", isSeller, async (req, res, next) => {
  try {
    const isCoupounCodeExists = await CoupounCode.find({ name: req.body.name });
    if (isCoupounCodeExists.length !== 0) {
      return next(new ErrorHandler("Coupoun code is already exists!", 404));
    }

    const coupounCode = await CoupounCode.create(req.body);
    res.status(201).json({
      success: true,
      message: "Coupon created successfully!",
      coupounCode,
    });
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
});

// get all coupouns
router.get("/get-coupoun/:id", isSeller, async (req, res, next) => {
  try {
    const coupounCode = await CoupounCode.find({
      "shop._id": req.params.id,
    });

    res.status(200).json({
      success: true,
      coupounCode,
    });
  } catch (error) {
    return next(new ErrorHandler(error, 404));
  }
});

// delete a coupoun
router.delete("/delete-coupoun/:id", isSeller, async(req,res,next)=>{
    try{
        const coupounId=req.params.id;
        const coupoun= await CoupounCode.findByIdAndDelete(coupounId);
        if(!coupoun){
            return next(new ErrorHandler("Coupon code doesn't exists!", 404));
        }
        res.status(200).json({
            success: true,
            message: "Coupon code deleted successfully",
        })
    }catch(error){
        return next(new ErrorHandler(error, 404));
    }
});

module.exports = router;
