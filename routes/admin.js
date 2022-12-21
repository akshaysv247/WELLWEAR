const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");
const productController = require("../controller/prodController");
const Acontroller = require("../controller/adminController");
const ses = require("../middleware/adminSession");
const upload = require("../middleware/multer");
const catUpload = require("../middleware/catMulter");
const couponControl=require('../controller/coupon')
const Order=require('../controller/order-controller');
const Banner=require('../controller/bannerControl')
const banMulter=require('../middleware/bannerMulter')


router.get("/", Acontroller.loginPage);
router.get("/admin-login", Acontroller.loginPage);

router.get("/admin-home", ses.adminSession, Acontroller.indexPage);
router.get("/index", ses.adminSession, Acontroller.indexPage);

//user pages
router.get("/user-list", ses.adminSession, authController.getAllUsers);
router.get("/userUnBlock/:id", ses.adminSession, authController.activeUsers);
router.get("/userBlock/:id", ses.adminSession, authController.blockedUsers);
router.get("/user-profile", ses.adminSession, Acontroller.userProfile);
router.get("/main-category", ses.adminSession, Acontroller.category);
router.get("/sub-category", ses.adminSession, Acontroller.subCategory);

//product pages
router.get("/product-add", ses.adminSession, Acontroller.addProd);
router.post(
  "/add-product",
  ses.adminSession,
  upload.uploadProductPic,
  upload.resizeProductPic,
  productController.addProducts
);
router.get("/add-product", ses.adminSession, Acontroller.proList);
router.get("/product-list", ses.adminSession, productController.getAllProducts);
router.get(
  "/product-delete/:id",
  ses.adminSession,
  productController.deleteProduct
);
router.get(
  "/product-edit/:id",
  ses.adminSession,
  productController.getProductDetail
);
router.post(
  "/product-edit",
  ses.adminSession,
  upload.uploadProductPic,
  upload.resizeProductPic,
  productController.editProduct
);

router.get("/product-grid", ses.adminSession, Acontroller.gridProduct);
router.get("/product-detail", ses.adminSession, Acontroller.proDetails);

//login
router.post("/admin-log", authController.adminLogin);
router.get("/admin-log", ses.adminSession, Acontroller.adminLog);

//Category Management
router.post(
  "/add-category",
  ses.adminSession,
  catUpload.uploadCategoryPic,
  catUpload.resizeCategoryPic,
  productController.addCategory
);
router.get("/add-category", ses.adminSession, productController.addCategory);
router.get(
  "/list-category",
  ses.adminSession,
  productController.getAllCategory
);
router.get(
  "/delete-category/:id",
  ses.adminSession,
  productController.deleteCategory
);
router.get(
  "/edit-category/:id",
  ses.adminSession,
  catUpload.resizeCategoryPic,catUpload.uploadCategoryPic,
  productController.getCategoryDetails
);
router.post(
  "/edit-category/:id",
  ses.adminSession,
  catUpload.resizeCategoryPic,
  catUpload.uploadCategoryPic,
  productController.editCategory
);

router.get('/add-coupon',ses.adminSession,couponControl.addCoupon)
router.post('/new-coupon',ses.adminSession,couponControl.addNewCoupon)
router.get("/coupon-list", ses.adminSession, couponControl.viewCoupon);
router.get('/delete-coupon',ses.adminSession,couponControl.deleteCoupon);

router.get('/view-orders',ses.adminSession,Order.getOrders)
router.patch("/cancel-Order",ses.adminSession,Order.cancelOrderAsAdmin);
router.get("/order-details", ses.adminSession, Order.viewOrderDeatails);

router.post('/update-status',ses.adminSession,Order.updateStatus)

router.get("/new-banner",ses.adminSession,Acontroller.addNewBanner);
router.get('/view-banners',ses.adminSession,Banner.getBanners);
router.post(
  "/add-banner",
  ses.adminSession,
  banMulter.uploadBannerPic,
  banMulter.resizeBannerPic,
  Banner.addBanners
);
router.patch('/delete-banner',ses.adminSession,Banner.deleteBanners)



//logout
router.get("/admin-logout", authController.adminLogout);

module.exports = router;
