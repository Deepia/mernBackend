const mongoose=require("mongoose");
//mongodb+srv://maha:<password>@cluster0.npz7a.mongodb.net/test
//mongodb://localhost:27017/merbackend-db
mongoose.connect(process.env.CONN_STRING,{
    useCreateIndex:true, useNewUrlParser:true, useUnifiedTopology:true,useFindAndModify:true
}).then(()=>{console.log("DB Connected")})
.catch((err)=>{console.log(err)})