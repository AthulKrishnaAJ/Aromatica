const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({

    name : {
        type : String,
        required : true
    },
    startDate : {
        type : Date,
        required : true
    },
    endDate : {
        type : Date,
        required : true
    },
    offerType : {
        type : String,
        enum : ['Product', 'Category'],
        required : true
    },
    discount : {
        type : Number,
        required : true
    },
    productId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true
    },
    categoryId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true
    },
    isActive : {
        type : Boolean,
        default : true
    }
});

const Offer = mongoose.model("Offer", offerSchema);
module.exports = Offer











    