const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "multivendor",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "avif"],
  },
});

exports.upload = multer({
  storage: storage,
});