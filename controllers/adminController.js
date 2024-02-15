const User = require("../models/userModel");
const bcrypt = require("bcrypt");


const getDashBoard = (req,res) => {
    try{
        res.render("adminView/dashBoard");
    }catch(error){
        console.log("rendering error in admin Dashboard",error.message);
        res.status(500).send("<h3>Internal error occured</h3>")
    }
}


const getAdminLogin = (req,res) => {
    try{
        res.render("adminView/adminLogin")
    }catch(error){
        console.log(`Page rendering error ${error.message}`)
    }
}

// admin login verfication
const verifyAdminLogin = async(req,res) => {
    try{
        const {email,password} = req.body
        const findAdmin = await User.findOne({email,isAdmin:1})
    
        if(findAdmin){
            const matchPassword = await bcrypt.compare(password,findAdmin.password);
            if(matchPassword){
                req.session.admin = true
                res.render("adminView/dashBoard");
                console.log("Admin logged successfully");
            }
            else{
                res.render("adminView/adminLogin",{message:"Password is not match"});
                console.log("Password is not match");
            }
        }
        else{
            res.render("adminView/adminLogin",{message:"You are not an admin"});
            console.log("Your are not an admin go away");
        }
    }catch(error){
        console.log("Admin login error",error.message);
        res.status(500).send({message:"Something wenet wrong"})
    }
   

}


const getLogout = (req,res) => {
    try {
        req.session.admin = null
        res.redirect("/admin/login")
    } catch (error) {
        console.log("Admin logout error occured",error.message);
    }
}





module.exports = {
    getAdminLogin,
    verifyAdminLogin,
    getDashBoard,
    getLogout,
    
}