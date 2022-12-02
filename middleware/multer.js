const multer = require('multer')
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


module.exports={
uploadProductPic : upload.fields([
        {
          name: 'thumbnail',
          maxCount: 1,
        },
        {
          name: 'image',
          maxCount: 4,
        },
      ]),

      resizeProductPic : (async (req, res, next) => {
        //Validations
        if (!req.files.thumbnail || !req.files.image) return next();
      
        // Get the thumbnail
        req.body.thumbnail = `product-${Date.now()}-thumb.jpeg`;
      
        await sharp(req.files.thumbnail[0].buffer)
          .resize(450, 450)
          .toFormat('jpeg')
          .jpeg({
            quality: 90,
          })
          .toFile(`public/productImages/${req.body.thumbnail}`);
      
        // Get the images array
        req.body.image = [];
        await Promise.all(
          req.files.image.map(async (el, i) => {
            const filename = `product-${Date.now()}-${i + 1}-image.jpeg`;
            await sharp(req.files.image[i].buffer)
              .resize(450, 450)
              .toFormat('jpeg')
              .jpeg({
                quality: 90,
              })
              .toFile(`public/productImages/${filename}`);
      
            req.body.image.push(filename);
          })
        );
        next();
      })

    }

