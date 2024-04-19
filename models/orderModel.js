const mongoose = require("mongoose");
const { stringify } = require("uuid");

const orderSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    items : [{
        productId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Product",
           
        },
        quantity : {
            type : Number,
            required : true
        },
        price : {
            type : Number,
            required : true
        }

    }],
    totalCost : {
        type : Number,
        require : true
    },
    address : {
        addressId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Address",
        required : true
        },
        addressType : {
            type : String,
            require : true
        },
        name : {
            type : String,
            require : true,
        },
        addressLine : {
            type : String,
            required : true
        },
        city : {
            type : String,
            required : true
        },
        state : {
            type : String,
            required : true
        },
        pincode : {
            type : Number,
            required : true
        },
        phone : {
            type : Number,
            required : true
        },
        altPhone : {
            type : Number,
            required : true
        }
    },
    paymentMethod : {
        type : String,
        enum : ["cash-on-delivery", "credit-card","paypal","razorpay","wallet"],
        required : true
    },
    status : {
        type : String,
        enum : ["pending", "processing", "shipped", "delivered","cancelled","return pending","returned","failure","payment pending"],
        default : "pending"
    },
    cancellationReason : {
        type : String,
        default : null
    },
    returnedReason : {
        type : String,
        default : null
    },
  
    
},{timestamps : true});

const Order = mongoose.model('Order',orderSchema);
module.exports = Order