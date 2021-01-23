const mongoose=require("mongoose");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const employeeSchema=new mongoose.Schema({
    userName:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        require:true
    },
    confirmPassword:{
        type:String,
        require:true
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
})

//generate auth token
employeeSchema.methods.generateAuthToken=async function(){
    try{

        const token=await jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY)
        this.tokens=this.tokens.concat({token:token});
        await this.save();
        return token;
    }
    catch(err){
        console.log(err);
    }
}

//create a middleware for hashing password
employeeSchema.pre("save", async function(next){
    if(this.isModified("password")){
    this.password=await bcrypt.hash(this.password,10);
    this.confirmPassword=undefined;
    }
    next();

})


//Create a collection
const Register=new mongoose.model("Register",employeeSchema);
module.exports=Register;