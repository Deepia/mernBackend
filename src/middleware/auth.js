const jwt=require("jsonwebtoken");
const Register=require("../models/registers");

const auth=async(req,res,next)=>{
    try{
          const token=req.cookies.jwt;
          const verify=jwt.verify(token,"munameisdeepakkumarsharma");
          console.log(verify);
          const user=await Register.findOne({_id:verify._id});
          //console.log(user);
          req.user=user;
          req.token=token;
          next();
    }
    catch(err){
        res.status(401).send(err);
    }
}

module.exports=auth;