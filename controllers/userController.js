import {User} from "../models/userModel.js"
import {Cart} from "../models/cartMode.js";
import {UserMsg} from "../models/messageModel.js";
import {PlaceOrder} from "../models/placeOrderModel.js";
import express from "express";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import {sendMail,
        sendMailForgot,
        data,
        auth,
        OTP,
        cart_total,
        get_cs
    } from "../functions/helper.js"
import ejs from "ejs";
import pdf from "html-pdf";
import path from "path";

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
    let cart_data = [0,0];;
    if(token){
        user = await data(req,res);
        cart_data = await cart_total(req,res);
    }
    const profile = await auth(req,res);
    let action = "LOG IN";
    if(profile) action = "LOG OUT";
    res.render("women",{action,profile,file: user ? user.file : "",ct:cart_data[0],cc:cart_data[1]});
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
    let cart_data = [0,0];;
    if(token){
        user = await data(req,res);
        cart_data = await cart_total(req,res);
    }
    else{
        return res.render("contact",{message:"please Login first",action:"LOG IN",profile:false,ct:cart_data[0],cc:cart_data[1]})
    }
    const {fname,lname1,lname2,email,message} = req.body
    const lname = lname1 || lname2;
    await UserMsg.create({fname,lname,email,message});
    const profile = await auth(req,res);
    let action = "LOG IN";
    if(profile) action = "LOG OUT";
    res.render("contact" ,{message:"Message sent successfully",action,email:user.email,profile,file: user ? user.file : "",ct:cart_data[0],cc:cart_data[1]});
}

const contactGet = async (req,res)=>{
    const {token} = req.cookies;
    let user;
    let profile = false,action = "LOG IN";
    let email;
    let cart_data = [0,0];;
    if(token){
        user = await data(req,res);
        email = user.email;
        profile = true;
        action = "LOG OUT"
        cart_data = await cart_total(req,res);
    }
    res.render("contact.ejs",{action,profile,email,file: user ? user.file : "",ct:cart_data[0],cc:cart_data[1]});
}

const producGet = async (req,res)=>{
    const {token} = req.cookies;
    let user;
    let profile = false,action = "LOG IN";
    let email;
    let cart_data = [0,0];;
    if(token){
        user = await data(req,res);
        email = user.email;
        profile = true;
        action = "LOG OUT"
        cart_data = await cart_total(req,res);
    }
    res.render("product.ejs",{action,profile,email,file: user ? user.file : "",ct:cart_data[0],cc:cart_data[1]});
}

const producPost = async(req,res) => {
    const itam = req.body;
    const user = await data(req,res);
    await Cart.create({
        phone:user.phone,
        path: itam.path,
        prize: itam.prize, 
        gender: itam.gender,
        quantity: itam.quntity,
        paymet: false,
    });
}

const Get = async (req,res)=>{
    const {token} = req.cookies;
    let user;
    let profile = false,action = "LOG IN";
    let email;
    let cart_data = [0,0];
    if(token){
        user = await data(req,res);
        email = user.email;
        profile = true;
        action = "LOG OUT"
        cart_data = await cart_total(req,res);
    }
    res.render("index.ejs",{action,profile,email,file: user ? user.file : "",ct:cart_data[0],cc:cart_data[1],ct:cart_data[0],cc:cart_data[1]});
}

const buyblazerGet = async (req,res)=>{
    const {token} = req.cookies;
    let user;
    let profile = false,action = "LOG IN";
    let email;
    let cart_data = [0,0];;
    if(token){
        user = await data(req,res);
        email = user.email;
        profile = true;
        action = "LOG OUT"
        cart_data = await cart_total(req,res);
    }
    res.render("buyblazer.ejs",{action,profile,email,file: user ? user.file : "",ct:cart_data[0],cc:cart_data[1],ct:cart_data[0],cc:cart_data[1]});
}

const menGet = async (req,res)=>{
    const {token} = req.cookies;
    let user;
    let profile = false,action = "LOG IN";
    let email;
    let cart_data = [0,0];;
    if(token){
        user = await data(req,res);
        email = user.email;
        profile = true;
        action = "LOG OUT"
        cart_data = await cart_total(req,res);
    }
    res.render("men.ejs",{action,profile,email,file: user ? user.file : "",ct:cart_data[0],cc:cart_data[1]});
}

const aboutGet = async (req,res)=>{
    const {token} = req.cookies;
    let user;
    let profile = false,action = "LOG IN";
    let email;
    let cart_data = [0,0];;
    if(token){
        user = await data(req,res);
        email = user.email;
        profile = true;
        action = "LOG OUT"
        cart_data = await cart_total(req,res);
    }
    res.render("about.ejs",{action,profile,email,file: user ? user.file : "",ct:cart_data[0],cc:cart_data[1]});
}

const editGet = async (req,res)=>{
    const {file} = await data(req,res);
    let cart_data = await cart_total(req,res);
    res.render("edit",{action:"LOG OUT",profile: true,file,ct:cart_data[0],cc:cart_data[1]})
}

const editPost = async(req,res)=>{
    let user = await data(req,res);
    let cart_data = await cart_total(req,res);
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
            return res.render("edit",{message:"User is exist",action:"LOG OUT",profile: true,file: user.file,ct:cart_data[0],cc:cart_data[1]})
        }
    }
    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch){
        return res.render("edit",{message:"Incorrect password",action:"LOG OUT",profile: true,file: user.file,ct:cart_data[0],cc:cart_data[1]})
    }
    await User.findByIdAndUpdate({_id : user._id},{$set:{
        name : name || user.name,
        file : req.file ? req.file.filename : user.file,
        phone : phone || user.phone
    }}) 
    const {file} = await data(req,res);
    if(email){
        updateEmail = email;
        return res.render("emailverification",{navbar:0,action:"LOG OUT",profile: true,file,email,resend:0,ct:cart_data[0],cc:cart_data[1]})
    }
    res.redirect("profile");
}

const profileGet =  async (req,res)=>{
    const user = await data(req,res);
    let cart_data =  await cart_total(req,res);
    const {email,name,file,phone,isverified} = user
    res.render("profile",{action:"LOG OUT",profile: true,email,phone,file,name,isverified,ct:cart_data[0],cc:cart_data[1]})
}

const profilePost = async (req,res) => {
    const user = await data(req,res);
    await User.deleteOne({_id: user._id});
    await PlaceOrder.deleteMany({phonef:user.phone});
    await Cart.deleteMany({phone:user.phone});
    res.cookie("token",null,{expires:new Date(Date.now())});
    res.redirect("/");
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
        let cart_data = await cart_total(req,res);
        res.render("emailverification",{navbar:0,action:"LOG OUT",profile: true,file,updateEmail,message: "OTP incorrect",OTPmessage: "OTP Sent Successfully",resend:1,ct:cart_data[0],cc:cart_data[1]})
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
    let cart_data = [0,0];
    if(token){
        const {file,name} = await data(req,res);
        cart_data = await cart_total(req,res);
        sendMail(name,updateEmail,req,res,file,0,cart_data[0],cart_data[1]);
    }
    else
        sendMail(globleUser.name,globleUser.email,req,res,globleUser.file,1,cart_data[0],cart_data[1]);
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

const cartGet = async(req,res) => {
    const {token} = req.cookies;
    let user;
    let cart_data = [0,0];
    let profile = false,action = "LOG IN";
    let email;
    if(token){
        user = await data(req,res);
        email = user.email;
        profile = true;
        action = "LOG OUT"
        cart_data = await cart_total(req,res);
    }
    const cart_itam = await Cart.find({phone:user.phone})
    res.render("cart.ejs",{action,profile,email,file: user ? user.file : "",itam:cart_itam,ct:cart_data[0],cc:cart_data[1]});
}

const cartPost = async (req,res) => {
    const {id} = req.body;
    await Cart.findByIdAndDelete({_id:id});
    res.redirect("cart");
}

const checkoutGet = async (req,res) => {
    const {token} = req.cookies;
    let user;
    let cart_data = [0,0];;
    let profile = false,action = "LOG IN";
    let email;
    if(token){
        user = await data(req,res);
        email = user.email;
        profile = true;
        action = "LOG OUT"
        cart_data = await cart_total(req,res);
    }
    const cart_itam = await Cart.find({phone:user.phone})
    res.render("checkout.ejs",{action,profile,email,file: user ? user.file : "",itam:cart_itam,ct:cart_data[0],cc:cart_data[1]});
}

const checkoutPost = async (req,res) => {
    const {phone,fname,lname,note,country,city,state,address,zip,email,cname} = req.body;
    const user = await data(req,res)
    const product = [];
    const cart_itam = await Cart.find({phone:user.phone});
    for(let i=0;i<cart_itam.length ;i++){
        if(! cart_itam[i].paymet){
            let obj = {
                prize:cart_itam[i].prize,
                gender:cart_itam[i].gender,
                quantity:cart_itam[i].quantity
            }
            product.push(obj);
            await Cart.findByIdAndUpdate({_id:cart_itam[i]._id},{$set:{
                paymet:true
            }})
        }
    }
    let add_info =await get_cs(country,state);
    const car = await PlaceOrder.create({phonef:user.phone,phone,date:new Date(),fname,lname,note,country:add_info[0],city,state:add_info[1],address,zip,email,cname,product});
    res.redirect("placedOrder");
}

const placedOrderGet = async (req,res) => {
    const user = await data(req,res);
    let cart_data = await cart_total(req,res);
    const {email,name,file,phone,isverified} = user
    const placedItam = await PlaceOrder.find({phonef:phone})
    res.render("placedOrder",{action:"LOG OUT",profile:true,email,phone,file,name,isverified,ct:cart_data[0],cc:cart_data[1],placedItam})
}

const pdfPost = async (req,res) => {
    const user = await data(req,res);
    const {itam} = req.body;
    let cart_data = await cart_total(req,res);
    const {email,name,file,phone,isverified} = user
    const placedItam = await PlaceOrder.find({phonef:phone,_id:itam})
    res.render("pdf",{action:"LOG OUT",profile:true,email,phone,file,name,isverified,ct:cart_data[0],cc:cart_data[1],placedItam})
}

const bill = async (req, res) => {
    const filePathName = path.resolve("E:/Project/P_Shopping_Point/views/pdf.ejs");

    const user = await data(req,res);
    const {itam} = req.body;
    const {email,name,phone} = user
    const placedItam = await PlaceOrder.find({phonef:phone,_id:itam})

    const ejsData = await ejs.renderFile(filePathName, { 
        basePath: 'http://localhost:4000/', 
        email: email,
        phone: phone,
        name: name,
        placedItam: placedItam
    });

    const modifiedHtml = ejsData.replace(/src="([^"]*)"/g, `src="http://localhost:4000/$1"`);

    let option = {
        format: 'A4',
        orientation: "portrait",
        border: "10mm"
    };
    
    pdf.create(modifiedHtml, option).toStream((err, stream) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Could not create PDF');
        }
        const pdf_name = user.name + ".pdf";
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment;filename= ${pdf_name}`);
        stream.pipe(res);
    });
};

export { 
    changePassword,
    forgotPasswoerdGet,
    forgotPasswoerdPost,
    sendotp,
    emailverificationPost,
    profileGet,
    profilePost,
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
    producPost,
    menGet,
    Get,
    logOut,
    randomUrl,
    cartGet,
    cartPost,
    checkoutGet,
    checkoutPost,
    placedOrderGet,
    bill,
    pdfPost
    }