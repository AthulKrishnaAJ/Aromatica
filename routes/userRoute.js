const express = require("express");


// File requirements
const userController = require("../controllers/userController");
const cartController = require("../controllers/cartController");
const {isLogged} = require("../Authentication/auth");
const orderController = require("../controllers/orderController");
const wishlistController = require("../controllers/wishlistController");



const route = express.Router();




// User actions
route.get("/",userController.loadHomePage);
route.get("/login",userController.loadUserLoginPage);
route.post("/login",userController.insertDetailsInLogin)
route.get("/signup",userController.loadSignUpPage);
route.post("/signup",userController.insertDetailsInSignUp);
route.get("/getOtp",userController.getOtPage);
route.post("/verifyOtp",userController.verifyOtp);
route.post("/resendOtp",userController.resendOtp);
route.get("/logout",isLogged,userController.logoutUser);
route.get("/emailVerification",userController.getEmailVerificationForForgotPassword)
route.post("/emailVerification",userController.insertEmailInEmailverfication)
route.get("/resetPassword",userController.getResetPasswordForForgotPassword);
route.post("/resetPassword",userController.insertPasswordInResetPassword);




// Profile actions
route.get("/profile",isLogged,userController.getUserProfile);
route.get("/addAddress",isLogged,userController.getAddAddress);
route.post("/addAddress",isLogged,userController.addAddress);
route.get("/editAddress",isLogged,userController.getEditAddress);
route.post("/editAddress",isLogged,userController.updateTheAddress);
route.post("/deleteAddress",isLogged,userController.deleteAddress);
route.post("/updateUserDetails",isLogged,userController.updateUserDetails)




// Product actions
route.get("/productDetails",userController.getProductDetails);
route.get("/shop",userController.getShopPage);
route.get("/filterCategory",userController.filterCategory)
route.get("/search",userController.searchProducts);
route.get('/filterPrice',userController.filterPriceRange);
route.get('/filterProductWithPrice',userController.sortProductWithPrice);
route.get('/sortProductWithName',userController.sortProductWithName);
route.get('/sortProductsOption',userController.sortProductsWithOption);




//Cart actions
route.get("/cart",isLogged,cartController.getCart);
route.post("/addToCart",isLogged,cartController.addToCart);
route.post("/updateCart",isLogged,cartController.changeProductQuantity);
route.post("/removeProduct",isLogged,cartController.removeProduct);




//order actions
route.get("/checkOut",isLogged,orderController.getCheckOutPage);
route.post("/checkOutAddAddress",isLogged,orderController.checkOutAddAddress);
route.post("/checkOut",isLogged,orderController.getCheckOutEditAddress);
route.post("/checkOutEditAddress",isLogged,orderController.checkOutUpdateAddress);
route.post("/placeOrder",isLogged,orderController.placeOrder);
route.get("/userOrderDetails",isLogged,orderController.userOrderDetailsPage)
route.post("/cancelOrderByUser/:orderId",isLogged,orderController.cancelOrderByUser)
route.post("/returnOrder/:orderId",isLogged,orderController.returnedOrderByUser)
route.get("/orderSuccess",isLogged,orderController.getOrderSuccessPage);




// wishlist actions
route.get("/wishlist",isLogged,wishlistController.getWishlist);
route.post("/wishlist",isLogged,wishlistController.addToWishlist)
route.post('/removeWishlist',isLogged,wishlistController.removeProductInWishlist)





module.exports = route;

