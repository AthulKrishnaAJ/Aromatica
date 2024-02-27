
const nodeMailer = require("nodemailer");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");


const User = require("../models/userModel");
const Products = require("../models/productModel");
const userHelper = require("../helpers/userHelper");
const { use } = require("bcrypt/promises");


//Load home Page
const loadHomePage = async(req,res) => {
    try{
        const user = req.session.user;
        const findUser = await User.findOne({});
        console.log("get find user");
        const productsData = await Products.find({isBlocked : false}).sort({ id : -1}).limit(4);   
        if(user){

            res.render("userView/home",{user : findUser , product : productsData});
        }
        else{
            res.render("userView/home",{product : productsData});
        }
    }catch(error){
        console.log(error.message);
        res.status(500).send("Internal error occured",error.message);
    }

}



// Load login page
const loadUserLoginPage = (req,res) => {
    try{
       if(!req.session.user){
            res.render("userView/userLogin")
       }
       else{
            res.render("/")
       }
    }catch(error){
        console.log(`Somthing error.... ${error}`);
        res.status(500).send("Internal error occured",error.message);

    }
}

// User insert the details on login page
const insertDetailsInLogin = async(req,res) => {
    try{
        const {email, password} = req.body;
        const user = await User.findOne({email:email,isAdmin:0})
        console.log(user);

        if(user){
            const userNotBlocked = user.isBlocked === false

            if(userNotBlocked){
                const matchPassword = await bcrypt.compare(password,user.password,)

                if(matchPassword){
                    req.session.user = user._id
                    res.redirect("/")
                    console.log("Login successfully");
                }
                else{
                    console.log("Password not match")
                    res.render("userView/userLogin",{message:"Password not matching"})
                }
                
            }
            else{
                console.log("User is blocked");
                res.render("userView/userLogin",{message:"User is blocked"})
            }
        }
        else{
            console.log("User not found");
            res.render("userView/userLogin",{message:"User not found please signup"})
        }
    }catch(error){
        console.log(error.message);
        res.status(500).render("userView/userLogin",{message:"something went wrong login failed"})

    }
}





// Load signup page
const loadSignUpPage = (req,res) => {
   try{
     if(!req.session.user){
        res.render("userView/userSignup");
     }
     else{
        res.render("/")
     }
   }catch(error){
        console.log(`Something went wrong ${error}`);
        res.status(500).send({message:"internal error occured"});   
   }
}





// User signing for generate OTP
const insertDetailsInSignUp = async(req,res) => {
    try{
        const {name,email,mobile,password} = req.body;
        const findUser = await User.findOne({ email });
        
        if(!findUser){
            //generate otp
            const otp = otpGenerator.generate(6,{ digits:true, lowerCaseAlphabets:false, upperCaseAlphabets:false, specialChars:false});
            console.log("This is OTP => ",otp);

         const info = await userHelper.sendOtpByEmail(email,otp);

              if(info){
                req.session.userOtp = otp
                req.session.userData = {name,email,mobile,password}
                res.render("userView/verifyOtp")
              }
                   
          }
          else{
            console.log("User already exist")
            res.render("userView/userSignup",{message:"User already exist change the email"});
          }
        

    }catch(error){
        console.log("Error in otp generation",error.message);
        res.render("userView/userSignup",{message:"Error in OTP generation, Please try again..!"})
    }
    
}



const getOtPage = async(req,res) => {
    try{
        res.render("userView/verifyOtp");
    }catch(error){
        console.log("Get otp page error",error.message);
    }

}
   


// verifiying OTP
const verifyOtp = async(req,res) => {
    console.log("1");
    try{
        const enteredOtp = req.body
        // console.log("session otp:",req.session.userOtp);
        // console.log("entered otp",enteredOtp.otp);
        console.log("2");
        if( req.session.userOtp === enteredOtp.otp){
            console.log("3");
            const userData = req.session.userData
            const passwordHash = await userHelper.securePassword(userData.password);
            console.log(passwordHash)

            const newUser = new User({
                name:userData.name,
                email:userData.email,   
                mobile:userData.mobile,
                password:passwordHash
            });
            await newUser.save()
            req.session.user = newUser._id;

            // clear session in saved datas
            // delete req.session.userOtp
            // delete req.session.userData

            console.log("rejistered successfully");
            res.render("userView/userLogin")
            // res.status(200).send({status:true})
          

        }else{
            console.log("OTP not matching");
            res.render("userView/verifyOtp",{message:"Ivalid OTP"})
            // res.json({status:false})
           
        }

    }catch(error){
        console.log("internal error:",error.message);
    }
   
}




const resendOtp = async(req,res) => {
    try{
        const email = req.session.userData.email;
        const newOtp = otpGenerator.generate(6,{digits:true,lowerCaseAlphabets:false,upperCaseAlphabets:false,specialChars:false});
        console.log(`${email} & ${newOtp}`)

        const info = await userHelper.resendOtpSendByEmail(email,newOtp);
        
        if(info){
            req.session.userOtp = newOtp
            res.json({success:true,message:"OTP resend successfully"});
        }
        else{
            res.json({success:false,message:"Resend OTP failed"})
        }
        
    }catch(error){
        console.log("Error in OTP generation",error.message);
        res.json({success:false,message:"Error in otp generation"});
    }
}








module.exports = {

    insertDetailsInSignUp,
    loadSignUpPage,
    loadHomePage,
    loadUserLoginPage,
    verifyOtp,
    insertDetailsInLogin,
    getOtPage,
    resendOtp
}


