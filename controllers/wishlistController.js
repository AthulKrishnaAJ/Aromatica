const Wishlist = require("../models/wihslistModel");
const Product = require("../models/productModel")


// get wishlist page
const getWishlist = async(req,res) => {
    try{
        const userId = req.session.user
        const wishlist = await Wishlist.findOne({user : userId}).populate('products.productId');
        res.render("userView/wishlist",{wishlist : wishlist, user : userId});
    }catch(error){
        console.log("Error in getting wishlist : ",error.message);
        res.status(500).send("Internal server error occur");
    }
}


// add to wishlist
const addToWishlist = async(req,res) => {
    try{
        const userId = req.session.user
        const {productId} = req.body

        const existingWishlist = await Wishlist.findOne({user : userId});

        const productDetails = await Product.findById(productId);

        if(existingWishlist){

            const existingItem = existingWishlist.products.some(product => product.productId.toString() === productId);
            if(existingItem){
            return res.json({status : false, message : "Product already in wishlist!"});
        }
        
        await Wishlist.findOneAndUpdate(
            {user : userId},
            {$push : {products : {productId : productId, price : productDetails.salePrice}}}
        );
            res.json({status : true, message : "Product add to wishlist!"});
    }
    else{
        const newWishlist = new Wishlist({
            user : userId,
            products : [{productId : productId, price : productDetails.salePrice}]
        });
        await newWishlist.save();
        res.json({status : true, message : "Product add to wishlist!"});
    }

    }catch(error){
        console.log("Error in adding product in the wishlist : ",error.message);
        res.status(500).send("Internal server occur");
    }
}


// remove product from wishlist
const removeProductInWishlist = async(req,res) => {
    try{
        const {productId} = req.body
        console.log("product id for removing proudct in wishlist=====>",productId)

        const updateWishlist = await Wishlist.findOneAndUpdate(
            {'products.productId' : productId},
            {$pull : {products : {productId : productId}}},
            {new : true}
        );

        if(updateWishlist){
            res.json({status : true, message : "Product removed"});
            console.log("Product has been removed from the wishlist");
        }
        else{
            res.json({status : false, message : "Product not removed,please try again"});
        }
   

    }catch(error){
        console.log("Error in removing product in wishlist : ",error.message);
        res.status(500).send("Internal server error");
    }
}

module.exports = {
    getWishlist,
    addToWishlist,
    removeProductInWishlist
}