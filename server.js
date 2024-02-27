import  express  from "express";
import dotene from "dotenv";
import mongoose from "mongoose";
import bodyparser from "body-parser"
import path from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import cookieParser from "cookie-parser";
import multer from "multer";

dotene.config();

const app = express();

app.use(express.static(path.join(path.resolve(),"public")))
app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({extended:false}));
app.use(cookieParser());

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
    isLogin:Boolean,
    file:String
})

const UserMsg = mongoose.model("UserMsg",messageSchema);
const User = mongoose.model("User", userSchema)

const userName = async (req) => {
    const {token} = req.cookies;
    const decoded = jwt.verify(token,"parth");
    const user = await User.findById(decoded._id);
    return user.name;
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,"public/Uploads");                   //path name will change
    },
    filename:async (req,file,cb) => {
        cb(null,Date.now()+'-'+await userName(req));
    },
});

const upload = multer({storage : storage});

const auth = async(req,res) => {
    const {token} = req.cookies;
    let profile = false;
    if(token){
        const decoded = jwt.verify(token,"parth");
        profile = true;
    }
    return profile
}

const data = async (req,res) => {
    const {token} = req.cookies;
    const decoded = jwt.verify(token, "parth");
    const user = await User.findById(decoded._id);
    return user;
}

const authentication = async (req,res,next) => {
    const {token} = req.cookies;
    if(token) res.redirect("/");
    else next();
}

const authnot = async (req,res,next) => {
    const {token} = req.cookies;
    if(token) next();
    else res.redirect("/");
}

app.get("/profile" ,authnot, async (req,res)=>{
    const user = await data(req,res);
    const {email,name,file,phone} = user
    res.render("profile",{action:"LOG OUT",profile: true,email,phone,file,name})
})

app.get("/edit" ,authnot, async (req,res)=>{
    const {file} = await data(req,res);
    res.render("edit",{action:"LOG OUT",profile: true,file})
})

app.post("/edit", upload.single('file') ,async(req,res)=>{
    const user = await data(req,res);
    const {password,name,email,phone} = req.body;
    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch){
        return res.render("edit",{message:"Incorrect password",action:"LOG OUT",profile: true,file: user.file})
    }
    const updatedUser = await User.findByIdAndUpdate({_id : user._id},{$set:{
        name : name || user.name,
        file : req.file ? req.file.filename :  user.file,
        email : email || user.email,
        phone : phone || user.phone,
    }})
    res.redirect("profile");
})

app.get("/contact",async (req,res)=>{
    const {token} = req.cookies;
    let user;
    let profile = false,action = "LOG IN";
    let email;
    if(token){
        user = await data(req,res);
        email = user.email;
        profile = true;
        action = "LOG OUT"
    }
    res.render("contact.ejs",{action,profile,email,file: user ? user.file : ""});
})

app.post("/contact",async (req,res)=>{
    const {token} = req.cookies;
    let user;
    if(token){
        user = await data(req,res);
    }
    else{
        return res.render("contact",{message:"please Login first",action:"LOG IN",profile:false})
    }
    const {fname,lname1,lname2,email,message} = req.body
    const lname = lname1 || lname2;
    await UserMsg.create({fname,lname,email,message});
    const profile = await auth(req,res);
    let action = "LOG IN";
    if(profile) action = "LOG OUT";
    res.render("contact" ,{message:"Message sent successfully",action,profile,file: user ? user.file : ""});
})

app.get("/about",async (req,res)=>{
    const {token} = req.cookies;
    let user;
    if(token){
        user = await data(req,res);
    }
    const profile = await auth(req,res);
    let action = "LOG IN";
    if(profile) action = "LOG OUT";
    res.render("about",{action,profile,file: user ? user.file : ""});
})
app.get("/buyblazer",async (req,res)=>{
    const {token} = req.cookies;
    let user;
    if(token){
        user = await data(req,res);
    }
    const profile = await auth(req,res);
    let action = "LOG IN";
    if(profile) action = "LOG OUT";
    res.render("buyblazer", {action,profile,file: user ? user.file : ""});
})
app.get("/", async(req,res)=>{
    const {token} = req.cookies;
    let user;
    if(token){
        user = await data(req,res);
    }
    const profile = await auth(req,res);
    let action = "LOG IN";
    if(profile) action = "LOG OUT";
    res.render("",{action,profile,file: user ? user.file : ""});
})
app.get("/signup",authentication,(req,res)=>{
    res.render("signUp");
})
app.post("/signup",authentication,async(req,res)=>{
    const {name,phone,email,password} = req.body;
    let user = await User.findOne({phone});

    if(user){
        res.render("signUp",{message: "Phone number is already registered"});
        return;
    }

    const hpass = await bcrypt.hash(password,10);

    user = await User.create({name,phone,email,password:hpass,isLogin:false,file:""});
    res.redirect("logIn");
})

app.get("/men",async (req,res)=>{
    const {token} = req.cookies;
    let user;
    if(token){
        user = await data(req,res);
    }
    const profile = await auth(req,res);
    let action = "LOG IN";
    if(profile) action = "LOG OUT";
    res.render("men",{action,profile,file: user ? user.file : ""});
})
app.get("/product",async (req,res)=>{
    const {token} = req.cookies;
    let user;
    if(token){
        user = await data(req,res);
    }
    const profile = await auth(req,res);
    let action = "LOG IN";
    if(profile) action = "LOG OUT";
    res.render("product",{action,profile,file: user ? user.file : ""});
})
app.get("/login",authentication,(req,res)=>{
    res.render("logIn");
})
app.post("/login",authentication, async (req,res)=>{
    const { phone, password } = req.body;
    
    let user = await User.findOne({phone});

    if(!user)
        return res.render("logIn",{message: "User can't exist"});

    const isMatch = await bcrypt.compare(password,user.password);

    if(!isMatch)
        return res.render("logIn",{phone, message: "Incorrect password"});

    const token = jwt.sign({_id:user._id}, "parth");
    res.cookie("token",token,{httpOnly:true,expires: new Date(Date.now() + (60000 * 60))});
    res.redirect("/");

})
app.get("/women",async (req,res)=>{
    const {token} = req.cookies;
    let user;
    if(token){
        user = await data(req,res);
    }
    const profile = await auth(req,res);
    let action = "LOG IN";
    if(profile) action = "LOG OUT";
    res.render("women",{action,profile,file: user ? user.file : ""});
})

app.post("/logout",(req,res) => {
    res.cookie("token",null,{expires:new Date(Date.now() )});
    res.redirect("/");
})


app.listen(process.env.PORT, () => {
    console.log(`Server is runnig on port ${process.env.PORT}`);
})