import {User} from "../models/userModel.js"
import express  from "express";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import {sendMail,
        sendMailForgot,
        data,
        auth,
        OTP
    } from "../functions/helper.js"

const app = express();

dotenv.config();

let globleUser = {};

let updateEmail = "";

const logOut = (req,res) => {
    res.cookie("token",null,{expires:new Date(Date.now() )});
    res.redirect("/");
}

const randomUrl = (req,res) => {
    res.render("random")
}

const womenGet = async (req,res)=>{
    const {token} = req.cookies;
    let user;
    if(token){
        user = await data(req,res);
    }
    const profile = await auth(req,res);
    let action = "LOG IN";
    if(profile) action = "LOG OUT";
    res.render("women",{action,profile,file: user ? user.file : ""});
}

const logInPost =  async (req,res)=>{
    const { phone, password } = req.body;
    
    let user = await User.findOne({phone});

    if(!user)
        return res.render("logIn",{message: "User can't exist"});

    const isMatch = await bcrypt.compare(password,user.password);

    if(!isMatch)
        return res.render("logIn",{phone, message: "Incorrect password"});

    const token = jwt.sign({_id:user._id}, process.env.ACCESS_TOKEN_SECERT);
    res.cookie("token",token,{httpOnly:true,expires: new Date(Date.now() + (60000 * 60))});
    res.redirect("/");
}

const logInGet = (req,res)=>{
    res.render("logIn");
}

const signUpPost = async(req,res)=>{
    const {name,phone,email,password} = req.body;
    let user = await User.findOne({phone});

    if(user){
        res.render("signUp",{message: "Phone number is already registered"});
        return;
    }

    let uniqueEmail = await User.findOne({email});

    if(uniqueEmail){
        res.render("signUp",{message: "Email is already registered"});
        return;
    }

    const hpass = await bcrypt.hash(password,10);
    globleUser = {
        name,
        phone,
        email,
        password:hpass
    }

    res.render("emailverification",{navbar:1,email});
}

const signUpGet = (req,res)=>{
    res.render("signUp");
}

const contactPost = async (req,res)=>{
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
}

const contactGet = async (req,res)=>{
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
}

const producGet = async (req,res)=>{
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
    res.render("product.ejs",{action,profile,email,file: user ? user.file : ""});
}

const Get = async (req,res)=>{
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
    res.render("index.ejs",{action,profile,email,file: user ? user.file : ""});
}

const buyblazerGet = async (req,res)=>{
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
    res.render("buyblazer.ejs",{action,profile,email,file: user ? user.file : ""});
}

const menGet = async (req,res)=>{
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
    res.render("men.ejs",{action,profile,email,file: user ? user.file : ""});
}

const aboutGet = async (req,res)=>{
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
    res.render("about.ejs",{action,profile,email,file: user ? user.file : ""});
}

const editGet = async (req,res)=>{
    const {file} = await data(req,res);
    res.render("edit",{action:"LOG OUT",profile: true,file})
}

const editPost = async(req,res)=>{
    let user = await data(req,res);
    const {password,name,isverified,email,phone} = req.body;
    if((user.email != email && email != "") || (user.phone != phone && phone != "")){
        const befoEmail = user.email;
        const befoPhone = user.phone;
        await User.findByIdAndUpdate({_id : user._id},{$set:{
            email : "",
            phone : "",
        }})
        let conEmail; 
        let conPhone;
        if(email) conEmail = await User.findOne({email});
        if(phone) conPhone = await User.findOne({phone});
        await User.findByIdAndUpdate({_id : user._id},{$set:{
            email : befoEmail,
            phone : befoPhone
        }})
        if(conEmail || conPhone){
            return res.render("edit",{message:"User is exist",action:"LOG OUT",profile: true,file: user.file})
        }
    }
    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch){
        return res.render("edit",{message:"Incorrect password",action:"LOG OUT",profile: true,file: user.file})
    }
    await User.findByIdAndUpdate({_id : user._id},{$set:{
        name : name || user.name,
        file : req.file ? req.file.filename : user.file,
        phone : phone || user.phone
    }}) 
    const {file} = await data(req,res);
    if(email){
        updateEmail = email;
        return res.render("emailverification",{navbar:0,action:"LOG OUT",profile: true,file,email,resend:0})
    }
    res.redirect("profile");
}

const profileGet =  async (req,res)=>{
    const user = await data(req,res);
    const {email,name,file,phone,isverified} = user
    res.render("profile",{action:"LOG OUT",profile: true,email,phone,file,name,isverified})
}

const emailverificationPost =  async(req,res)=>{
    const {otp} = req.body; 
    const {token} = req.cookies;
    if(token){
        let {file,isverified,_id} = await data(req,res);
        if(otp == OTP){
            await User.findByIdAndUpdate({_id},{$set:{
                isverified: true ,
                email:updateEmail
            }})
            return res.redirect("profile")
        }
        res.render("emailverification",{navbar:0,action:"LOG OUT",profile: true,file,updateEmail,message: "OTP incorrect",OTPmessage: "OTP Sent Successfully",resend:1})
    }
    else{
        if(otp==OTP){
            const {name,email,password,phone} = globleUser;
            await User.create({name,phone,email,password,isLogin:false,isverified:true,file:""});
            globleUser={};
            return res.redirect("login")
        }
        res.render("emailverification",{navbar:1,email:globleUser.email,message: "OTP incorrect",OTPmessage: "OTP Sent Successfully",resend:1})
    }
}

const sendotp =  async(req,res)=>{
    const {token} = req.cookies;
    if(token){
        const {file,name} = await data(req,res);
        sendMail(name,updateEmail,req,res,file,0);
    }
    else
        sendMail(globleUser.name,globleUser.email,req,res,globleUser.file,1);
}

const forgotPasswoerdPost = async (req,res)=>{
    const {email,otp} = req.body;
    const e = Object.keys(req.body)[0]
    if((email) || (e && e!="otp" && e!="email")){
        const user = await User.findOne({email: email ? email : e});
        if(user){
            const {email} = user;
            sendMailForgot(email,res);
        }
        else{
            res.render("forgotPassword",{OTPmessage:"Email is invalid"}); 
        }
    }
    else{
        const email = Object.keys(req.body)[1]
        const {isverified,_id} = await User.findOne({email});
        if(otp == OTP){ 
            if(!isverified){ 
                await User.findByIdAndUpdate({_id},{$set:{
                    isverified: true 
                }})
            }
            const token = jwt.sign({email}, process.env.ACCESS_TOKEN_SECERT);
            res.cookie("email",token,{httpOnly:true,expires: new Date(Date.now() + (60000 * 15))});
            return res.render("changePassword");
        } 
        res.render("forgotPassword",{email,message:"OTP incorrect",OTPmessage: "OTP Sent Successfully"})
    }
}

const forgotPasswoerdGet = (req,res)=>{
    res.render("forgotPassword");
}

const changePassword = async (req,res)=> {
    const {pass1, pass2} = req.body;
    if(pass1!=pass2) res.render("changePassword",{message: "Both password can't match"});
    else{
        const {email} = req.cookies;
        const decoded = jwt.verify(email, process.env.ACCESS_TOKEN_SECERT);
        const user = await User.findOneAndUpdate({email:decoded.email},{$set:{
            password: await bcrypt.hash(pass2,10)
        }});
        res.cookie("email",null,{expires:new Date(Date.now())});
        res.redirect("login")
    }
}

export { 
    changePassword,
    forgotPasswoerdGet,
    forgotPasswoerdPost,
    sendotp,
    emailverificationPost,
    profileGet,
    editPost,
    editGet,
    contactGet,
    contactPost,
    signUpGet,
    signUpPost,
    logInGet,
    logInPost,
    womenGet,
    buyblazerGet,
    aboutGet,
    producGet,
    menGet,
    Get,
    logOut,
    randomUrl
    }