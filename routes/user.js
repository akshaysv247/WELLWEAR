const express=require('express')
const router = express.Router();
const authController=require('../controller/authController')
const Ucontroller = require("../controller/userController");
const otpAuth=require('../utils/otpAuthentication')
const Uses=require('../middleware/userSession')
const reqms=require('../controller/requirements')
const wishlistControl = require('../controller/wishlistControl');
const cartControl=require('../controller/cartController')
const CheckOut=require('../controller/checkoutController');
const checkoutController = require('../controller/checkoutController');
const orders=require('../controller/order-controller')
const category=require('../controller/catControl')
const Coupons=require('../controller/coupon')
const cartWish=require('../middleware/cartWish');


router.get('/',Ucontroller.homePage)

router.get('/home',Ucontroller.Home)
router.get("/contact",reqms.requirements, Ucontroller.contactPage);
router.get("/shop",Ucontroller.shopPage);

router.patch('/add-wishlist',Uses.userSession,wishlistControl.addToWishlist)
router.get("/wishlist",Uses.userSession,reqms.requirements,wishlistControl.getWishlist);
router.patch("/delete-wish", Uses.userSession, wishlistControl.deleteWish);


router.patch('/add-cart',cartControl.addItemtoCart)
router.get('/cart',Uses.userSession,cartControl.getCart)
router.patch('/remove-cart',Uses.userSession,cartControl.removeCart)
router.patch('/increase-quantity',Uses.userSession,cartControl.incrementQuantity)
router.patch("/reduce-quantity",Uses.userSession,cartControl.decrementQuantity);

router.get("/product-details",reqms.requirements,Ucontroller.productDeatails);
router.get('/get-cat-item',category.getProductByCat)

router.get('/myAc',reqms.requirements,Ucontroller.getMyAcc)
router.get('/add-address',Uses.userSession,Ucontroller.Address)
router.post("/adding-address",Uses.userSession,Ucontroller.addAddress);
router.patch("/delete-address",Uses.userSession,Ucontroller.deleteAddress);
router.get('/edit-address',Uses.userSession,Ucontroller.getAddressDetails)
router.get('/show-coupons',Uses.userSession,Coupons.showCoupons)


//payments and checkouy
router.get("/checkout",Uses.userSession,CheckOut.toCheckout);
router.post('/checking-out',Uses.userSession,CheckOut.checkingOut)
router.get('/order-details',Uses.userSession,orders.getOrderDetails)
router.post("/verify-payment",Uses.userSession,CheckOut.verifyPayment);
router.get('/thankyou',Uses.userSession,CheckOut.thankYou)
router.get('/cancel-order',Uses.userSession,orders.cancelOrder)
router.post('/check-coupon',Uses.userSession,Coupons.checkCoupon)




//authentications
router.get('/user-log',Ucontroller.userLogin)
router.get('/signup',Ucontroller.userSignup)
router.get('/user-log',Ucontroller.userLogin)
router.post('/register',authController.signupUser,otpAuth.sendOtp)
router.post("/otp-validate", authController.makeOtp);
router.get('/register',Ucontroller.registerUser)
router.post('/login',authController.loginUser)
router.get("/user-logout", authController.userLogout);
router.get("/forgettPassword",authController.getResestPas);
router.post("/forget-pass",authController.sendResetOtp,otpAuth.sendOtp);
router.post("/Resetotp-validate", authController.makeResetOtp);
router.post("/reset-password",authController.resetPassword);
module.exports=router;