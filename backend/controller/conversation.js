const express = require("express");
const router = express.Router();
const Conversation = require("../model/conversation");
const ErrorHandler = require("../utils/ErrorHandler");
const { isSeller, isAuthenticated } = require("../middleware/auth");

router.post("/create-new-conversation", async (req, res, next) => {
  try {
    const { groupTitle, userId, sellerId } = req.body;
    const isConversationExists = await Conversation.findOne({ groupTitle });
    if (isConversationExists) {
      const conversation = isConversationExists;
      res.status(200).json({
        success: true,
        conversation,
      });
    }else{
        const conversation= await Conversation.create({
            members:[userId, sellerId],
            groupTitle: groupTitle,
        });

        res.status(201).json({
            success:true,
            conversation,
        })
    }
  } catch (error) {
    return next(new ErrorHandler(error, 500));
  }
});

// get seller conversation
router.get("/get-all-conversation-seller/:id", isSeller, async(req, res, next)=>{
    try{
        const conversations= await Conversation.find({
            members:{
        $in: [req.params.id],
            }
    }).sort({updateAt:-1, createdAt: -1});

        res.status(200).json({
            success: true,
            conversations,
        })

    }catch (error) {
    return next(new ErrorHandler(error, 500));
  }
});

// get user conversations
router.get("/get-all-conversation-user/:id", isAuthenticated, async(req, res, next)=>{
  try{
    const conversations = await Conversation.find({
      members: {
        $in: [req.params.id],
      },
    }).sort({ updatedAt: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      conversations,
    });
  }catch(error){
    return next(new ErrorHandler(error, 500));
  }
});

// update the last message
router.put("/update-last-message/:id", async(req, res, next)=>{
  try{
    const {lastMessage, lastMessageId}= req.body;
    const conversation= await Conversation.findByIdAndUpdate(req.params.id,{
      lastMessage,
      lastMessageId,
    }, { returnDocument: "After" })

    res.status(200).json({
      success: true,
      conversation,
    })

  }catch(error){
    return next(new ErrorHandler(error, 500));
  }
})

module.exports = router;
