require("dotenv").config();
const express= require("express");
require("./db/conn");
const Register=require("./models/registers");
const auth=require("./middleware/auth");
const app=express();
const path=require("path");
const hbs=require("hbs");
const cookieParser=require("cookie-parser");
const port=process.env.PORT || 3000;
const static_path=path.join(__dirname,"../public")
const template_path=path.join(__dirname,"../templates/views");
const partial_path=path.join(__dirname,"../templates/partials");
console.log(static_path);
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static(static_path));
app.use(cookieParser());
app.set("view engine","hbs");
app.set("views",template_path);
hbs.registerPartials(partial_path);
 const bcrypt=require("bcryptjs");
// const securePassword=async(password)=>{
//     const hasedPassword=await bcrypt.hash(password,10);
//     console.log(hasedPassword);
//     const matchedOrNot=await bcrypt.compare("deepak",hasedPassword);
//     console.log(matchedOrNot);
// }

//securePassword("deepak@123");

//for creating token
// const jwt=require("jsonwebtoken");

// const createToken=async()=>{
//     const token = await jwt.sign({_id:"123456qwerty"},"munameisdeepakkumarsharma",
//     {expiresIn:"5 minutes"});
//     console.log("token: "+token);
//     const isVerify=await jwt.verify(token,"munameisdeepakkumarsharma");
//     console.log(isVerify);
// }

//createToken();


app.get("",(req,res)=>{
    res.render("index");
})
app.get("/about",(req,res)=>{
    console.log(`Cookie value: ${req.cookies.jwt}`)
    res.render("about");
})
app.get("/secret",auth,(req,res)=>{
    res.render("secret");
})
app.get("/weather",(req,res)=>{
    res.render("weather");
})
app.get("/login",(req,res)=>{
    res.render("login");
})
app.get("/logout",auth,async(req,res)=>{
    try{
        console.log("delete start");
        //for delete a single device for logout single device
        
        // req.user.tokens=req.user.tokens.filter((currentElement)=>{
        //     return currentElement.token !== req.token;
        // })

        //for logout all device
        req.user.tokens=[];
        console.log("delete end");
        res.clearCookie("jwt");
        await req.user.save();
        console.log("logout done");
        res.render("login");
    }
    catch(err){
        res.status(401).send(err);
    }
    
})

app.post("/register",async(req,res)=>{
    try{
         const password=req.body.password;
         const cpassword=req.body.confirmpassword;
         if(password===cpassword){
           const registerUser=new Register({
            userName:req.body.username,
            email:req.body.email,
            password:req.body.password,
            confirmPassword:req.body.confirmpassword

           });
           const token=await registerUser.generateAuthToken();
           res.cookie("jwt",token,{
               expires:new Date(Date.now()+120000)
           });
           const savedData=await registerUser.save();
           res.status(201).render("index");
        }
        else{
            res.send("Password mismatch, Plz try again");
        }
    }
    catch(err){
        res.status(400).send(err);
    }
    
})

app.post("/login",async(req,res)=>{
    try
    {
        const userDetails=await Register.findOne({email:req.body.email});
        const matched= await bcrypt.compare(req.body.password,userDetails.password);

        if(matched){
            const token=await userDetails.generateAuthToken();
            console.log("login token: "+token);
            //for storing the token in cookies
            res.cookie("jwt",token,{
                expires:new Date(Date.now()+600000)
            });
            res.status(201).render("index");
        }
        else{
            res.status(400).send("Invalid login details.");
        }


    }
    catch(err){
        res.status(400).send("Invalid login details.");
    }

})

app.listen(port,()=>{
    console.log(`Server is running on ${port}`);
})