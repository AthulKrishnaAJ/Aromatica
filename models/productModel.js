const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
 
    productName : {
        type : String,
        require : true

    },
    description : {
        type : String,
        require : true
    },
    category : {
        type : String,
        require : true
    },
    regularPrice : {
        type : Number,
        require : true
    },
    salePrice : {
        type : Number,
        require : true
    },
    createdOn : {
        type : String,
        require : true
    },
    quantity : {
        type : Number,
        require : true
    },
    isBlocked : {
        type : Boolean,
        default : false
    },
    productImage : {
        type : Array,
        require : true
    },
    size : {
        type : Number,
        require : true
    }

});

const product = mongoose.model("Product",productSchema);

module.exports = product

