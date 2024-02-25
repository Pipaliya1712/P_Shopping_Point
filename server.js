import  express  from "express";
import dotene from "dotenv";
import mongoose from "mongoose";
import bodyparser from "body-parser"
import path from "path";

dotene.config();

const app = express();

app.use(express.static(path.join(path.resolve(),"public")))
app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({extended:false}));

mongoose.connect("mongodb://localhost:27017/p_shopping_point",{useNewUrlParser: true, useUnifiedTopology:true}).
    then(()=> console.log("database connected")).
    catch((err) => console.log(err));

const messageSchema = new mongoose.Schema({
    fname:String,
    lname:String,
    email:String,
    message:String,
})

const userSchema = new mongoose.Schema({
    name:String,
    phone:Number,
    email:String,
    password:String,
    isLogin:Boolean
})

const UserMsg = mongoose.model("UserMsg",messageSchema);
const User = mongoose.model("User", userSchema)

app.get("/contact",(req,res)=>{
    res.render("contact.ejs");
})

app.post("/contact",async (req,res)=>{
    const {fname,lname1,lname2,email,message} = req.body
    const lname = lname1 || lname2;
    const user = await UserMsg.create({fname,lname,email,message});
    res.render("contact" ,{message:"Message sent successfully"});
})

app.get("/about",(req,res)=>{
    res.render("about");
})
app.get("/buyblazer",(req,res)=>{
    res.render("buyblazer");
})
app.get("/",(req,res)=>{
    res.render("");
})
app.get("/signup",(req,res)=>{
    res.render("signUp");
})
app.post("/signup",async(req,res)=>{
    const {name,phone,email,password} = req.body;
    let user = await User.findOne({phone});

    if(user){
        res.render("signUp",{message: "Phone number is already registered"});
        return;
    }

    user = await User.create({name,phone,email,password,isLogin:false});
    console.log(user);
    res.render("logIn",{Sign_up: "Sign up successfully, Please login"});
})

app.get("/men",(req,res)=>{
    res.render("men");
})
app.get("/product",(req,res)=>{
    res.render("product");
})
app.get("/login",(req,res)=>{
    res.render("logIn");
})
app.post("login",(req,res)=>{
    // const nam=
})
app.get("/women",(req,res)=>{
    res.render("women");
})


app.listen(process.env.PORT, () => {
    console.log(`Server is runnig on port ${process.env.PORT}`);
})