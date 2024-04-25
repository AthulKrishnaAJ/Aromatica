
// package requirements
const moment = require('moment');
const cron = require('node-cron');


// file requirements
const Coupon = require('../models/couponModel');
const adminHelper = require('../helpers/adminHelper')
const Cart = require('../models/cartModel');



// get coupon manage page in admin side
const getCouponPage = async(req,res) => {
    try{
        const couponDetails = await Coupon.find().sort({createdAt : -1}).populate('usedBy')
        res.render('adminView/coupon',{couponDetails : couponDetails}); 

    }catch(error){
        console.log("Error in getting coupon page : ",error.message);
        res.status(500).send("Internal server error");
    }
}



// adding coupon by admin
const addingCoupon = async(req,res) => {
    try{
        const {couponName, minimumPrice, couponAmount, couponExpiry} = req.body

        const newCouponCode = await adminHelper.generateCouponCode()
        console.log("=====>>>>>> :",newCouponCode);

        const expiryDate = moment(couponExpiry, 'DD/MM/YYYY', true);

        if(!expiryDate.isValid()){
            console.log("Invalid date");
            return res.json({success : false, message : "Invalid expiration date"});
           
        }
        
        const existinCoupon = await Coupon.findOne({
            $or : [
                {couponName : couponName},
                {couponCode : newCouponCode}
            ]
        });

        if(existinCoupon){
            console.log("Coupon already exist");
            return res.json({success : false, message : "Coupon already exist"});
        }

        const newCoupon = new Coupon({
            couponName : couponName,
            couponCode : newCouponCode,
            minimumPrice : parseFloat(minimumPrice),
            discount : parseFloat(couponAmount),
            expiryDate : expiryDate.toDate()
        });

        await newCoupon.save();
        console.log("=====>Coupon added");
        res.json({success : true, message : "Coupon added"});
        
    }catch(error){
        console.log("Error in adding coupon : ",error.message);
        res.status(500).send("Internal server error occur");
    }
}



//schedule for coupon update
cron.schedule('0 0 * * *', () => {
    console.log("day and night");
    adminHelper.updateCouponValidity();
})





// change coupon status by admin
const changeCouponStatus = async(req,res) => {
    try{
        const couponId = req.params.couponId
        const {status} = req.body
     
        const statusChanged = await Coupon.findByIdAndUpdate(couponId,{isActive : status});

        if(!statusChanged){
            console.log("Cannot change coupon status.....");
            return res.json({success : false, message : "Please try again"});
        }

        console.log("Coupon status changed.....");
        res.json({success : true});
    }catch(error){
        console.log("Error in changing status : ",error.message);
    }
}




// delete coupon by admin
const deleteCoupon = async(req,res) => {
    try{
        const couponId = req.params.couponId;

        const isDeleted = await Coupon.findByIdAndDelete(couponId);
        
        if(isDeleted){
            console.log("Coupon deleted success....")
            return res.json({success : true, message : "Coupon deleted successful"});
        }
        else{
            console.log("Coupon cannot deleted......")
            return res.json({success : false, message : "Falied to delete coupon"});
            
        }
    }catch(error){
        console.log("Error in deleting coupon :",error.message);
        res.status(500).send("Internal server error");
    }
}


// apply coupon by user
const couponApply = async(req,res) => {
    try{
        const {couponCode} = req.body;
        const userId = req.session.user
        console.log(">=>=>=>=>",couponCode);

        const userCart = await Cart.findOne({user : userId});

        if(!userCart){
            console.log('Cannot find the cart for this user');
        }

        const coupon = await Coupon.findOne({couponCode : couponCode, isActive : true});
        if(!coupon){
            return res.json({success : false, message : "Invalid coupon code"});
        }

        if(coupon.isValid === 'Expired'){
            return res.json({success : false, message : "Coupon expired"});
        }

        const userAlreadyUsed = coupon.usedBy.find(id => id.toString() === userId.toString())
        if(userAlreadyUsed){
            return res.json({success : false, message : "Coupon already used"});
        }

        if(userCart.appliedCoupon || userCart.appliedCoupon === coupon._id){
            return res.json({success : false, message : "Already this coupon"});
        }

        userCart.totalCost -= coupon.discount
        userCart.appliedCoupon = coupon._id

        coupon.usedBy.push(userId);

        await Promise.all([coupon.save(), userCart.save()]);

        console.log("Coupon applied");
        res.json({success : true, message : "Coupon applied", userCart : userCart, coupon : coupon});

    }catch(error){
        console.log("Error in applying coupon :",error.message);
        res.status(500).send("Internal server error");
    }
}




// remove coupon by user
const removeCoupon = async(req,res) => {
    try{
        const userId = req.session.user

        const  userCart = await Cart.findOne({user : userId});
        if(!userCart){
            console.log("Cannot find the cart this user...");
            return;
        }
        
        if(!userCart.appliedCoupon){
            return res.json({success : false, message : "Coupons are not applied"});
        }

        const coupon = await Coupon.findById(userCart.appliedCoupon);
        if(!coupon){
            return res.json({success : false, message : "Coupon not found"});
        }

        userCart.totalCost = userCart.totalCost + coupon.discount

        const index = coupon.usedBy.indexOf(userId);
        if(index > -1){
            coupon.usedBy.splice(index, 1);
        }

        userCart.appliedCoupon = null

        await Promise.all([userCart.save(), coupon.save()]);

        console.log("Counpon removed successful...");
        res.json({success : true, message : "Coupon removed", userCart : userCart});
        
    }catch(error){
        console.log("Error in removing coupon :",error.message);
        res.status(500).send("Internal server error");
    }
}

module.exports = {
    getCouponPage,
    addingCoupon,
    changeCouponStatus,
    deleteCoupon,
    couponApply,
    removeCoupon
}