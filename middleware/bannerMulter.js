const multer = require('multer');
const sharp = require("sharp");
const Banner= require("../model/bannerSchema");
const path = require("path");

//////////////////////////////////////////////////////////////////////

// //Multer setup



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
  uploadBannerPic: upload.fields([
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),

  resizeBannerPic: async (req, res, next) => {
    console.log('kjfbgibfi')
    //Validations
    console.log(req.body)
    if (!req.files.thumbnail) return next();

    // Get the thumbnail
    req.body.thumbnail = `banner-${Date.now()}-thumb.jpeg`;

    await sharp(req.files.thumbnail[0].buffer)
      .resize(1330, 630)
      .toFormat("jpeg")
      .jpeg({
        quality: 90,
      })
      .toFile(`public/bannerImg/${req.body.thumbnail}`);   
    next();
  },
};

// const multer = require("multer");

// const productImageStorage = multer.diskStorage({
//   destination: (req, file, callback) => {
//     callback(null, "./public/products-images");
//   },
//   filename: (req, file, callback) => {
//     const filename = file.originalname.replace(/\s+/g, "-");

//     callback(null, Date.now() + "-" + filename);
//   },
// });

// const categoryImageStorage = multer.diskStorage({
//   destination: (req, file, callback) => {
//     console.log(file);
//     callback(null, "./bannerImg");
//   },
//   filename: (req, file, callback) => {
//     const filename = file.originalname.replace(/\s+/g, "-");
//     callback(null, Date.now() + "-" + filename);
//   },
// });

// const uploadProductImgs = multer({
//   storage: productImageStorage,
// }).fields([
//   {
//     name: "thumbnail",
//     maxCount: 1,
//   },

// ]);

// const uploadBannerImg = multer({ storage: categoryImageStorage }).single(
//   "image"
// );

// module.exports = { uploadProductImgs, uploadBannerImg };
