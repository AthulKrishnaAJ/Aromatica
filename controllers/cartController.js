const Products = require("../models/productModel");
const User = require("../models/userModel");
const Cart = require("../models/cartModel");


// User get the cart page
const getCart = async(req,res) => {
    try{
        const userId = req.session.user

        const cart = await Cart.findOne({user : userId}).populate('items.product');
        if(!cart){
            res.render("userView/cart",{cart : "Cart is empty" , user : userId});
        }
        else{
            res.render("userView/cart",{cart : cart , user : userId});
        }

    }catch(error){
        console.log(`Cart page rendering error : ${error.message}`);
    }
}



// Product added in the cart

const addToCart = async(req,res) => {
    try{
        const productId = req.query.id
        const quantity = req.query.quantity
        const userId = req.session.user

        // if(!userId){
        //     return res.json({status : "Please Login"})
        // }

        let cart = await Cart.findOne({user : userId});
        const product = await Products.findById(productId);

        if(!product || product.quantity <= 0 || product.isBlocked){
           return res.json({status : "Product Unavailable"});
        }
        
        if(!cart){
            cart = new Cart({user : userId});
        }

        const existingItem = cart.items.find(item => item.product.equals(productId));

 
        if(!existingItem || (existingItem.quantity + parseInt(quantity)) <= product.quantity){

        if(existingItem){
            existingItem.quantity += parseInt(quantity)
            existingItem.price += product.salePrice * parseInt(quantity)
        }
        else{
            cart.items.push({
                product : productId,
                quantity : parseInt(quantity),
                price : product.salePrice * parseInt(quantity)
            })
        }

        cart.totalQuantity += parseInt(quantity);
        cart.totalCost += product.salePrice * parseInt(quantity);

        await cart.save();

        res.json({status : true});
    }
    else{
        res.json({status : false , message : "Out of stock"});
    }

    }catch(error){
      console.error(`Internal server error occur in add to cart ${error.message}`);
      res.status(500).json({status : false, message : "Something Wrong"});
    }
    

}




// Update quantity
const changeProductQuantity = async(req,res) => {
    try{
        const {productId,quantity} = req.body;
        const userId = req.session.user;
        console.log(`ProductId is  =>${productId} \n quantity is  =>${quantity} \n user Id is  => ${userId}`);

        const cart = await Cart.findOne({user : userId});
        const product = await Products.findById(productId);

        if(!cart || !product){
            return res.json({status : false , message : "Invalid request"});
        }

        const existingItem = cart.items.find(item => item.product.equals(productId));

        if(!existingItem){
            return res.json({status : false , message : "Item not found"});
        }
        
        let newQuantity = existingItem.quantity + parseInt(quantity);

        // Check if cart quantity reaches the product quantity
        if(newQuantity > product.quantity){
            return res.json({status : false , message : "Quantity limit reached !"});
        }

         else if(newQuantity === 0){
            return res.json({status : false, message : "Keep minimum atleast 1 quantity !"})
        }

        existingItem.quantity = newQuantity;
        existingItem.price = product.salePrice * newQuantity;
        cart.totalQuantity = cart.totalQuantity + parseInt(quantity);
        cart.totalCost = cart.totalCost + (product.salePrice * parseInt(quantity));

        await cart.save()

        res.json({status : true});
    }catch(error){
        console.log("Error updating cart : ", error.message);
        res.status(500).json({status : false , message : "Internal server error..!"});
    }
}



// Removed product in the cart
const removeProduct = async(req,res) => {
    try{
        const productId = req.body.productId
        const userId = req.session.user
        console.log(`Product id is   => ${productId}`);

        const cart = await Cart.findOne({user : userId});

        if(!cart){
            return res.json({status : false , message : "Cart not found"});
        }

        const removedItem = cart.items.find(item => item.product.equals(productId));

        if(!removedItem){
            return res.json({status : true , message : "Product not found in the cart"});
        }

        const result = await Cart.updateOne(
            {user : userId},
            {$pull : {items : {product : productId}}}
        );

        if(result){

            cart.totalQuantity = cart.totalQuantity - removedItem.quantity
            cart.totalCost = cart.totalCost - removedItem.price

            await cart.save();
            res.json({status : true});
        }
        else{
            res.json({status : false , message : "Product not found in the cart"});
        }
                        

    }catch(error){
        console.log("Error in removing product : ",error.message);
        res.status(500).json({status : false , message : "Internal server error"});
    }
}





module.exports = {
    getCart,
    addToCart,
    changeProductQuantity,
    removeProduct
}





