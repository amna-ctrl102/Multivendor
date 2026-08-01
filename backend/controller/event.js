const express=require("express");
const router=express.Router();
const Event=require("../model/event");
const { upload } = require("../multer");
const ErrorHandler = require("../utils/ErrorHandler");
const Shop = require("../model/shop");
const { isSeller } = require("../middleware/auth");
const fs= require("fs");

router.post("/create-event", upload.array("images"), async(req,res,next)=>{
    try{
        const shopId=req.body.shopId;
        const shop= await Shop.findById(shopId);

        if(!shop){
            return next(new ErrorHandler("Shop Id is invalid!",400));
        }else{
            const files=req.files;
            const imageUrls=files.map((file)=>`uploads/${file.filename}`);
            const eventData=req.body;
            eventData.images=imageUrls;
            eventData.shop=shop;

            const event= await Event.create(eventData);
            res.status(201).json({
                success:true,
                event,
            })
        }
    }catch(error){
        return next(new ErrorHandler(error,400));
    }
});

// get event of a specific shop
router.get("/get-all-events-shop/:id", async(req,res,next)=>{
    try{
        const events= await Event.find({shopId: req.params.id});

        res.status(201).json({
            success:true,
            events,
        });
    }catch(error){
        return next(new ErrorHandler(error,404));
    }
});

// delete event of a shop
router.delete("/delete-shop-event/:id", isSeller,  async(req,res,next)=>{
    try{
        const eventId= req.params.id;
        const eventData= await Event.findById(eventId);

        eventData.images.forEach((imageUrl)=>{
            const filename = imageUrl;
            const filePath = `${filename}`;
            fs.unlink(filePath, (err) => {
                if (err) console.log(err);
            });
        });

        const event= await Event.findByIdAndDelete(eventId);

        if(!event){
            return next(new ErrorHandler("event is not found with this Id!",404));
        }

        res.status(200).json({
            success:true,
            message:"event deleted successfully",
        })

    }catch(error){
        return next(new ErrorHandler(error, 400));
    }
});

// get events of all shops
router.get("/get-all-events", async(req,res,next)=>{
    try{
        const allEvents = await Event.find();
        res.status(200).json({
            success:true,
            allEvents,
        });
    }catch(error){
        return next(new ErrorHandler(error, 400));
    }
});

module.exports=router;