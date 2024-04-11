const User = require("../models/userModel");
const Products = require("../models/productModel");
const Cart = require("../models/cartModel");
const Address = require("../models/addressModel");
const mongoose = require("mongoose");
const Order = require("../models/orderModel");
// const ObjectId = require('mongoose').Types.ObjectId


// Get check Out page
    const getCheckOutPage = async(req,res) => {
        try{
            const userId = req.session.user
        
            const allAddresses  = await Address.findOne({user : userId});

            const userCart = await Cart.findOne({user : userId});

            // console.log("user cart issssss  =>",userCart);
            if(!userCart){
                console.log("Cart not found for the user");
                res.status(404).send("Cart not founded for the user")
            }
            
                const cartDetails = await Cart.aggregate([

                    {$match : {user : new mongoose.Types.ObjectId(userId)}},
                    {$unwind : "$items"},
                    {
                        $lookup : {
                            from : "products",
                            localField : "items.product",
                            foreignField : "_id",
                            as : "product"
                        }
                    },
                    {$unwind : "$product"},
                    {
                        $group : {
                            _id : "$_id",
                            items : {
                                $push : {
                                    productName : "$product.productName",
                                    quantity : "$items.quantity",
                                    totalPrice : "$items.price",
                                }
                            },
                            totalCost : {$sum : "$items.price"}
                        }
                    }
                   
                ])
                console.log("cart details isssss   =>",cartDetails);
    
            res.render("userView/checkOut",{allAddresses : allAddresses, user : userId, cartDetails : cartDetails});
            console.log("Check out page rendering successfully");
    

    }catch(error){
        console.log("Error in rendering check out page : ", error.message);
        res.status(500).send("Internal server error occur");
    }
}




// Add address in check out
const checkOutAddAddress = async(req,res) => {
    try{
        const userId = req.session.user
        const {addressType, name, addressLine, city, state, pincode, phone, altPhone} = req.body

        const existingAddress = await Address.findOne({user : userId});
        if(existingAddress){
            existingAddress.addresses.push({
                addressType : addressType,
                name : name,
                addressLine : addressLine,
                city : city,
                state : state,
                pincode : pincode,
                phone : phone,
                altPhone : altPhone
            });
           
            await existingAddress.save();
            console.log("User already have an address, new address push in the address array");
        }
        else{
            const newAddress = new Address({
                user : userId,
                addresses : [{

                addressType : addressType,
                name : name,
                addressLine : addressLine,
                city : city,
                state : state,
                pincode : pincode,
                phone : phone,
                altPhone : altPhone

                }]
            });
            await newAddress.save();
            console.log("New address added")
        }

        res.redirect("/checkOut");
        

    }catch(error){
        console.log(`ERROR in adding address ${error.message}`);
        res.status(500).send("Internal server occur");
    }
}

// get check out page
const getCheckOutEditAddress = async(req,res) => {
    try{
        const userId = req.session.user
        const addressId = req.query.id

        const allAddresses = await Address.findOne({user : userId});
        console.log(addressId,"address id modallllllllllll");
        
        const address = allAddresses.addresses.find(address => address._id.equals(addressId));
        if(address){
            res.json({address : address});
        }
        else{
            console.log("Address not foud for edit in the check out page");
        }
        
    }catch(error){
       console.log("error occur in getting edit address page in the check out page", error.message);
       res.status(500).send("Internal server occur");
    
    }
}

// update address in the checkout page
const checkOutUpdateAddress  = async(req,res) => {
    try{
        const userId = req.session.user
        const {addressId, addressType, name, addressLine, city, state, pincode, phone, altPhone} = req.body
        console.log("======>",addressId, addressType, name, addressLine, city, state, pincode, phone, altPhone);
        console.log("address id isssssss   => ",addressId)

       const upadateAddress = await Address.findOneAndUpdate(
        {"addresses._id" : addressId},
        {
            $set : {
                "addresses.$.addressType" : addressType,
                "addresses.$.name" : name,
                "addresses.$.addressLine" : addressLine,
                "addresses.$.city" : city,
                "addresses.$.state" : state,
                "addresses.$.pincode" : pincode,
                "addresses.$.phone" : phone,
                "addresses.$.altPhone" : altPhone
            }
        },
        {new : true}
       );

       if(upadateAddress){
        res.json({success : true, user : userId});
        console.log("Address updated");
       }
       else{
        res.json({success : false, user : userId});
        console.log("Address not updated");
       }
       
        
    }catch(error){
        console.log("Error in updating address in check out page : ", error.message);
        res.status(500).send("Internal server error occur");
    }
}
    

// Place order by user
const placeOrder = async(req,res) => {
    try{
        const userId = req.session.user
        const {selectAddressId, paymentMethod} = req.body
        console.log("selectedAddressssssss   => :",selectAddressId);
      
        if(!selectAddressId){
            return res.status(400).send("ERROR!.to select an address for placing order");
        }
        if(!paymentMethod){
            return res.status(400).send("ERROR!.to select payment method for placing order");
        }
        const selectedAddress = await Address.findOne({user : userId})
        // console.log("Select user address==========> : ",selectedAddress);

        const addressDetails = selectedAddress.addresses.find(address => address._id.equals(selectAddressId))
        console.log("Select address====================> : ",addressDetails);

        if(!addressDetails){
            return res.status(404).send("Selected address not found");
        }

        const userCart = await Cart.findOne({user : userId}).populate("items.product");
        console.log("user cart ============>",userCart);

        if(!userCart){
            return res.status(404).send("Cart not found for the user");
        }
        const newOrder = new Order({
            user : userId,
            items : userCart.items.map(item =>({
                productId : item.product,
                quantity : item.quantity,
                price : item.price
            })),
            totalCost :userCart.totalCost,
            address: {
                addressId: addressDetails._id,
                addressType: addressDetails.addressType,
                name: addressDetails.name,
                addressLine: addressDetails.addressLine,
                city: addressDetails.city,
                state: addressDetails.state,
                pincode: addressDetails.pincode,
                phone: addressDetails.phone,
                altPhone: addressDetails.altPhone
            },
            paymentMethod : paymentMethod
        });
         const saveOrder = await newOrder.save();
        console.log("Order saved")
        await Promise.all(userCart.items.map(async(item) => {
            const product = item.product
            const updateQuantity = product.quantity - item.quantity
            await Products.findByIdAndUpdate(product._id,{quantity : updateQuantity});
        }));

        await Cart.findByIdAndUpdate(userCart._id,{items : [], totalQuantity : 0, totalCost : 0});

        res.status(200).json({success : true, orderId : saveOrder._id});
        

    }catch(error){
        console.log("Error in place order : ", error.message);
        res.status(500).send("Internal server error occur");
    }
}


// get order list page by admin
const getOrderListPage = async(req,res) => {
    try{
        const page = req.query.page || 1
        const perPage = 4 

        const orderCount = await Order.countDocuments()
        const totalPage = Math.ceil(orderCount / perPage);

        const order = await Order.find({})
        .populate({
            path : "user",
            select : "name email mobile"
        }).sort({createdAt : -1}).skip((page - 1) * perPage).limit(perPage)

        res.render("adminView/orderList",{order : order, currentPage : page, totalPage : totalPage});
    }catch(error){
        console.log("Error in getting order listin page : ",error.message);
        res.status(500).send("Intrenal server error")
    }
}


// delete order by admin
const cancelOrderByAdmin = async(req,res) => {
    try{
        const orderId = req.params.orderId
        const order = await Order.findById(orderId);

        console.log("Orders details for cancelling order ===> :", order);

        if(!order){
            res.json({status : false, message : "Order not found"});
        }

        for(const item of order.items){
            await Products.findByIdAndUpdate(item.productId, {$inc : {quantity : item.quantity}})
        }

        order.status = 'cancelled';
        await order.save();
        res.json({status : true, message : "order cancelled"});

    }catch(error){
        console.log("Error in cancelling order : ",error.message);
        res.status(500).send("Internal server error occur");
    }
}



// get order details page in the admin side
const getOrderDetailsPage = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const order = await Order.findById(orderId)
            .populate('user')
            .populate('items.productId')
            .populate('address');

        res.render("adminView/orderDetails", { order: order });
    } catch (error) {
        // Handle error
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};


// change the order status
const changeOrderStatus = async(req,res) => {
    try{
        const {orderId, checknewStatus} = req.body
        console.log(`order id ===> ${orderId}  status ===> ${checknewStatus}`)

        const order = await Order.findById(orderId);
        if(!order){
            return res.json({stats : false, message : "Order not found"});
        }
        if(checknewStatus === "returned"){
            for(const item of order.items){
                await Products.findByIdAndUpdate(item.productId,{$inc : {quantity : item.quantity}});
            }
        }

        order.status = checknewStatus
        await order.save();
        console.log("Status changed success fully")
        res.json({status : true, message : "Status changed"});
    }catch(error){
        console.log("Error in changin status", error.message);
        res.status(500).send("Internal server error occur");
    }
}


// get order details in the user side
const userOrderDetailsPage = async(req,res) => {
    try{
        const userId = req.session.user
        const orderId = req.query.orderId
        const order = await Order.findById(orderId).populate('user').populate('items.productId').populate('address.addressId')
        res.render("userView/userOrderDetails",{order : order, user : userId});
    }catch(error){
        console.log("Error in getting user order detsils : ",error.message);
        res.status(500).send("Internal server error occcur");
    }
}


const cancelOrderByUser = async(req,res) => {
    try{
        const userId = req.session.user
        const orderId = req.params.orderId
        const {reason} = req.body
        const order = await Order.findById(orderId);

        console.log("Orders details for cancelling order ===> :", order);
        console.log("Cancellation reason ======>", reason)

        if(!order){
            res.json({status : false, message : "Order not found"});
        }

        for(const item of order.items){
            await Products.findByIdAndUpdate(item.productId, {$inc : {quantity : item.quantity}})
        }

        // order.items.forEach((item) => {
        //     item.quantity = 0;
        //     item.price = 0;
        // });
        // order.totalCost = 0;
        order.cancellationReason = reason
        order.status = 'cancelled';
        await order.save();
        res.json({status : true, message : "Order Cancelled", user : userId});

    }catch(error){
        console.log("Error in cancelling order : ",error.message);
        res.status(500).send("Internal server error occur");
    }
}



const returnedOrderByUser = async(req,res) => {
    try{
        const userId = req.session.user
        const orderId = req.params.orderId
        const {reason} = req.body
        console.log("orderId=======>", orderId)
        console.log("========>", reason);

        const order = await Order.findById(orderId)

        if(!order){
            return res.json({success : false, message : 'Order not found for return'});
        }

        // for(const item of order.items){
        //     await Products.findByIdAndUpdate(item.productId,{$inc : {quantity : item.quantity}});
        // }

        order.returnedReason = reason
        order.status = 'return pending'
        await order.save();
        res.json({success : true, message : "Request sent for return", user : userId})
    }catch(error){
        console.log("Error in order return : ", error.message);
        res.status(500).send("Internal server error");
    }
}



const getOrderSuccessPage = async(req,res) => {
    try{
        const orderId = req.query.orderId
        res.render("userView/orderSuccessPage",{orderId : orderId});

    }catch(error){
        console.log("Error in getting order success page : ",error.message);
        res.status(500).send("Internal server error occur");
    }
}





module.exports = {
    getCheckOutPage,
    checkOutAddAddress,
    getCheckOutEditAddress,
    checkOutUpdateAddress,
    placeOrder,
    getOrderListPage,
    getOrderDetailsPage,
    changeOrderStatus,
    userOrderDetailsPage,
    cancelOrderByUser,
    cancelOrderByAdmin,
    getOrderSuccessPage,
    returnedOrderByUser
}