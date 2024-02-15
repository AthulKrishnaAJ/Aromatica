const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    id : {
        type : String,
        require : true
    },
    name : {
        type : String,
        require : true

    },
    descriptioin : {
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
        type : Number,
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
        type : String,
        require : true
    }

});

const product = mongoose.model("Product",productSchema);

module.exports = product

