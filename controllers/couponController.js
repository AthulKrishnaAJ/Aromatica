

const getCouponPage = async(req,res) => {
    try{
        res.render('adminView/coupon');
    }catch(error){
        console.log("Error in getting coupon page : ",error.message);
        res.status(500).send("Internal server error");
    }
}


module.exports = {
    getCouponPage
}