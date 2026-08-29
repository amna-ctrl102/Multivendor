const express = require("express");
const router = express.Router();
const Messages = require("../model/message");
const ErrorHandler = require("../utils/ErrorHandler");
const { upload } = require("../multer");

// create new message
router.post(
  "/create-new-message",
  upload.array("image"),
  async (req, res, next) => {
    try {
      const messageData = req.body;
      if (req.files) {
        const files = req.files;
        const imageUrls = files.map((file) => `uploads/${file.filename}`);
        messageData.images = imageUrls;
      }

      messageData.conversationId = req.body.conversationId;
      messageData.sender = req.body.sender;
      messageData.text = req.body.text;

      const message = new Messages({
        conversationId: messageData.conversationId,
        sender: messageData.sender,
        text: messageData.text,
        images: messageData.images ? messageData.images : undefined,
      });

      await message.save();
      res.status(201).json({
        success: true,
        message,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 500));
    }
  },
);

// get all messages with conversation id
router.get("/get-all-messages/:id", async (req, res, next) => {
  try {
    const messages = await Messages.find({
      conversationId: req.params.id,
    });

    res.status(201).json({
      success: true,
      messages,
    });
  } catch (error) {
    return next(new ErrorHandler(error.response.message), 500);
  }
});

module.exports = router;
