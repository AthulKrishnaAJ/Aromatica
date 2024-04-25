const express = require("express")
const nocache = require('nocache')

// files imported
const {isAdmin} = require("../Authentication/auth");
const adminController = require("../controllers/adminController");
const categoryController = require("../controllers/categoryController");
const productController = require("../controllers/productController");
const customerController = require("../controllers/customerController");
const orderController = require("../controllers/orderController");
const couponController = require("../controllers/couponController");
const offerController = require('../controllers/offerController')

const route = express.Router()
route.use(nocache());


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



// User management
route.get("/users",isAdmin,customerController.getCustomer)
route.get("/blockCustomer",isAdmin,customerController.blockCustomers)
route.get("/unBlockCustomer",isAdmin,customerController.unBlockCustomers)



//Category management
route.get("/category",isAdmin,categoryController.getCategory);
route.post("/addCategory",isAdmin,categoryController.addCategory);
route.get("/allCategory",isAdmin,categoryController.getAllCategory)
route.get("/listCategory",isAdmin,categoryController.listCategory);
route.get("/unlistCategory",isAdmin,categoryController.unListCategory);
route.get("/editCategory",isAdmin,categoryController.getEditCategory);
route.post("/editCategory/:id",isAdmin,categoryController.updateCategory);




// Product mangement
route.get("/addProduct",isAdmin,productController.getAddProduct);
route.post("/addProduct",isAdmin,upload.array("images",3),productController.addProduct);
route.get("/product",isAdmin,productController.getProduct);
route.get("/blockProduct/:productId",isAdmin,productController.blockProduct);
route.get("/unBlockProduct/:productId",isAdmin,productController.unBlockProduct);
route.get("/editProduct",isAdmin,productController.getEditProduct);
route.delete("/deleteImage/:productId/:filename",isAdmin,productController.deleteImage);
route.post("/editProduct/:productId",isAdmin,upload.array("images",3),productController.updateProduct);



//Order management
route.get("/orderList",isAdmin,orderController.getOrderListPage);
route.post("/cancelOrderByAdmin/:orderId",isAdmin,orderController.cancelOrderByAdmin);
route.get("/orderDetails/:orderId",isAdmin,orderController.getOrderDetailsPage);
route.post("/changeStatus",isAdmin,orderController.changeOrderStatus);



// Coupon management
route.get("/getCoupon",isAdmin,couponController.getCouponPage);
route.post("/addCoupon",isAdmin,couponController.addingCoupon);
route.put("/changeCouponStatus/:couponId",isAdmin,couponController.changeCouponStatus);
route.post("/deleteCoupon/:couponId",isAdmin,couponController.deleteCoupon);


// sales report actions
route.get('/getSalesReport', isAdmin, adminController.getSalesReportPage);
route.get('/getCustomSalesReport', isAdmin, adminController.getCustomSalesReport);
route.post('/generatePdf', isAdmin, adminController.generatePdf);



// offer actions
route.get('/getOffer', isAdmin, offerController.getOfferPage);
route.post('/addOffer', isAdmin, offerController.addOffer)

module.exports = route












