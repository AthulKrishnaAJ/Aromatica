
const express = require("express");
const path = require("path")
const session = require("express-session");
const cookieParser = require("cookie-parser");
const uuid = require("uuid");
const nocache = require("nocache");
const mongoose = require("mongoose");
const dotEnv = require("dotenv")


// routes
const userRoute = require("./routes/userRoute");
const adminRoute = require("./routes/adminRoute")



//Conneted to mongoDB
mongoose.connect("mongodb://127.0.0.1:27017/AromaticaDb");

mongoose.connection.on("connected",() => {
    console.log("Connected to MongoDb");
});
mongoose.connection.on("erro",(err) => {
    console.log(`Error connection to MongoDb ${err}`);
});
mongoose.connection.on("disconnected",() => {
    console.log("Disconnected from MongoDb");
})



const app = express();
const Port = process.env.PORT || 1001


dotEnv.config()


//Set view engine
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));


app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.use(cookieParser());

app.use(nocache());

app.use(express.static(path.join(__dirname,"public")));



app.use(session({
    secret:uuid.v4(),
    resave:false,
    saveUninitialized:true,
    cookie:{maxAge:600000,
        httpOnly:true
    }

    
}));

app.use("/",userRoute);
app.use("/admin",adminRoute);




app.listen(Port,() => {
    console.log(`server runnig on http://localhost:${Port}`);
})









