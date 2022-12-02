const express=require('express')
const router = express.Router();
const authController=require('../controller/authController')
const Ucontroller = require("../controller/userController");
const otpAuth=require('../utils/otpAuthentication')
const Uses=require('../middleware/userSession')
const reqms=require('../controller/requirements')
const wishlistControl = require('../controller/wishlistControl');
const cartControl=require('../controller/cartController')
const CheckOut=require('../controller/checkoutController')



router.get('/',Ucontroller.homePage)

router.get('/home',Ucontroller.Home)
router.get("/contact",reqms.requirements, Ucontroller.contactPage);
router.get("/shop",Ucontroller.shopPage);

router.get('/add-wishlist',Uses.userSession,wishlistControl.addToWishlist)
router.get("/wishlist",Uses.userSession,reqms.requirements,wishlistControl.getWishlist);
router.get('/delete-wish',Uses.userSession,reqms.requirements,wishlistControl.deleteWish)

router.get('/add-cart',cartControl.addItemtoCart)
router.get('/cart',Uses.userSession,cartControl.getCart)
// router.get('/delete-cart',Uses.userSession,cartControl.deleteFromCart)

router.get("/product-details",reqms.requirements,Ucontroller.productDeatails);

router.get('/myAc',reqms.requirements,Ucontroller.getMyAcc)

router.get("/checkout",CheckOut.toCheckout);




//authentications
router.get('/user-log',Ucontroller.userLogin)
router.get('/signup',Ucontroller.userSignup)
router.get('/user-log',Ucontroller.userLogin)
router.post('/register',authController.signupUser,otpAuth.sendOtp)
router.post("/otp-validate", authController.makeOtp);
router.get('/register',Ucontroller.registerUser)
router.post('/login',authController.loginUser)
router.get("/user-logout", authController.userLogout);

module.exports=router;