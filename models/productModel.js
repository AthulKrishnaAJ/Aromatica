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
        categoryId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Category",
        require : true
        },
        name : {
            type : String,
            require : true
        }
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
},{timestamps : true});

const product = mongoose.model("Product",productSchema);

module.exports = product

