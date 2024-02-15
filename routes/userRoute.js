const express = require("express");

const userController = require("../controllers/userController");
const {isLogged} = require("../Authentication/auth")


const route = express.Router();




// user actions
route.get("/",userController.loadHomePage);
route.get("/login",userController.loadUserLoginPage);
route.post("/login",userController.insertDetailsInLogin)
route.get("/signup",userController.loadSignUpPage);
route.post("/signup",userController.insertDetailsInSignUp);
route.get("/getOtp",userController.getOtPage);
route.post("/verifyOtp",userController.verifyOtp);
route.post("/resendOtp",userController.resendOtp);





module.exports = route;

