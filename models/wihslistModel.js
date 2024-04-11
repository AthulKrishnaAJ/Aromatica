const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        require : true
    },
    products : [{
        productId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Product",
            require : true
        },
        price : {
            type : Number,
            require : true
        }
    }]
},{timestamps : true});

const Wishlist = mongoose.model("Wishlist",wishlistSchema);
module.exports = Wishlist