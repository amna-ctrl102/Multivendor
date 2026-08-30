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
      const { conversationId, sender, text } = req.body;

      // Cloudinary image URLs
      const imageUrls = req.files?.map((file) => file.path) || [];

      const message = new Messages({
        conversationId,
        sender,
        text,
        images: imageUrls.length > 0 ? imageUrls : undefined,
      });

      await message.save();

      res.status(201).json({
        success: true,
        message,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
);

// get all messages with conversation id
router.get("/get-all-messages/:id", async (req, res, next) => {
  try {
    const messages = await Messages.find({
      conversationId: req.params.id,
    });

    res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

module.exports = router;