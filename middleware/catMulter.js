const multer = require("multer");
const sharp = require("sharp");
const Product = require("../model/productSchema");
const path = require("path");

//////////////////////////////////////////////////////////////////////

//Multer setup
const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("File is not an image"), false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

module.exports = {
  uploadProductPic: upload.fields([
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),

  resizeProductPic: async (req, res, next) => {
    //Validations
    if (!req.files.thumbnail) return next();

    // Get the thumbnail
    req.body.thumbnail = `product-${Date.now()}-thumb.jpeg`;

    await sharp(req.files.thumbnail[0].buffer)
      .resize(450, 450)
      .toFormat("jpeg")
      .jpeg({
        quality: 90,
      })
      .toFile(`public/catImages/${req.body.thumbnail}`);   
    next();
  },
};
