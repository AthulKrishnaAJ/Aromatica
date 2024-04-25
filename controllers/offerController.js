const Product = require('../models/productModel');
const Category = require('../models/categoryModel');
const Offer = require('../models/offerModel');


const getOfferPage = async(req, res) => {
    try{
        const product = await Product.find({isBlocked : false}).sort({createdAt : -1});
        const category = await Category.find({isListed : true});
        res.render('adminView/Offer', {product : product, category : category});
        console.log("get add offer page");
    }catch(error){
        console.log("Error in getting offer page :", error.message);
    }
}


const addOffer = async(req, res) => {
    try{
        const {offerName, startDate, endDate, offerType, availableProducts, availableCategory, discountPrice} = req.body
        console.log(offerName,startDate, endDate, offerType, availableProducts, availableCategory, discountPrice)


    }catch(error){
        console.log("Error in adding offer :", error.message);
        res.json({success : false, message : 'Internal server error'});
    }
}


module.exports = {
    getOfferPage,
    addOffer
}