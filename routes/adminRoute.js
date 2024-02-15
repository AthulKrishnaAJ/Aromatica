const express = require("express")



const {isAdmin} = require("../Authentication/auth")
const adminController = require("../controllers/adminController")
const categoryController = require("../controllers/categoryController")



const route = express.Router()


//multer setting
const multer = require("multer");
const storage = require("../helpers/multer");
const upload = multer({storage : storage});
route.use("/public/uploads",express.static("/public/uploads"))



// admin actions
route.get("/",isAdmin,adminController.getDashBoard);
route.get("/login",adminController.getAdminLogin);
route.post("/login",adminController.verifyAdminLogin);
route.get("/logout",isAdmin,adminController.getLogout);



//Category management
route.get("/category",isAdmin,categoryController.getCategory);
route.post("/addCategory",isAdmin,categoryController.addCategory);
route.get("/allCategory",isAdmin,categoryController.getAllCategory)
route.get("/listCategory",isAdmin,categoryController.listCategory);
route.get("/unlistCategory",isAdmin,categoryController.unListCategory)
route.get("/editCategory",categoryController.getEditCategory)









module.exports = route












module.exports = route