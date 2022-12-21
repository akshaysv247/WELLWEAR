const multer = require("multer");
const sharp = require("sharp");
const Category = require("../model/categorySchema");
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
  uploadCategoryPic: upload.fields([
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),

  resizeCategoryPic: async (req, res, next) => {
    console.log('ivde eththi')
    //Validations
    console.log(req.body)
    if (!req.files.thumbnail) return next();

    // Get the thumbnail
    req.body.thumbnail = `category-${Date.now()}-thumb.jpeg`;

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
