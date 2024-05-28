import nodemailer from "nodemailer";
import express from "express";
import dotenv from "dotenv"
import jwt from "jsonwebtoken"
import { User } from "../models/userModel.js";
import {Cart} from "../models/cartMode.js";

const app = express();
dotenv.config();

let OTP ;

const data = async (req,res) => {
    const {token} = req.cookies;
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECERT);
    const user = await User.findById(decoded._id);
    return user;
}

const auth = async(req,res) => {
    const {token} = req.cookies;
    let profile = false;
    if(token){
        const decoded = jwt.verify(token,process.env.ACCESS_TOKEN_SECERT);
        profile = true;
    }
    return profile
}

const emailTransporter = () => {
    OTP = Math.floor(Math.random() * 900000) + 100000;

    return {
        trans: {
            host:'smtp.gmail.com',
            service:"gmail",
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:process.env.USERNAME_SMTP,
                pass:process.env.PASSEORD_SMTP
            }
        },
        otp: OTP
    }
}

const sendMailForgot = async(email,res) => {
    const emailtrans = emailTransporter();
    OTP = emailtrans.otp;

    const transporter = nodemailer.createTransport(emailtrans.trans);

    const mailOptions = {
        from:"parthpipaliya1112@gmail.com",
        to:email,
        subject:"Verify your Email",
        html:`<div style="margin: 0px; padding: 0px; background-color: #998780; display: flex; height: 100vh;">
                <div style="width: 650px; border: 1px solid black; background-color: white; margin: auto;">
                    <div style="margin: 15px; font-size: 25px; font-weight: bolder; font-family: system-ui; ">P Shopping Point</div>
                    <hr style="margin: 0px;">
                    <div style="font-size: 25px; font-weight: bolder; font-family: system-ui; margin: 20px;">
                        Reset the password 
                    </div>
                    <div  style="font-size: 16px; font-family: system-ui; margin: 20px;">
                        Enter the following code to reset password: <br>
                        Ans if your Email is not verify then it verify automatically.
                    </div>
                    <div style="font-size: 25px; font-weight: bolder; font-family: system-ui; margin: 20px;">
                        ${OTP}
                    </div>
                </div>
            </div>`
    }
    transporter.sendMail(mailOptions, (err,info)=>{
        if(err) {
            console.log(err);
        }
        else {
            console.log("Email has been sent :" , info.response);
            return res.render("forgotPassword",{email,OTPmessage: "OTP Sent Successfully",resend:0})
        }
    });
}

const sendMail = async (name,email,req,res,file,act,ct,cc) => {
    const emailtrans = emailTransporter();
    OTP = emailtrans.otp;
    const transporter = nodemailer.createTransport(emailtrans.trans);
    console.log(email);
    const mailOptions = {
        from:"parthpipaliya1112@gmail.com",
        to:email,
        subject:"Verify your Email",
        html:`<div style="margin: 0px; padding: 0px; background-color: #998780; display: flex; height: 100vh;">
                <div style="width: 650px; border: 1px solid black; background-color: white; margin: auto;">
                    <div style="margin: 15px; font-size: 25px; font-weight: bolder; font-family: system-ui; ">P Shopping Point</div>
                    <hr style="margin: 0px;">
                    <div style="font-size: 25px; font-weight: bolder; font-family: system-ui; margin: 20px;">
                        Verify your email address
                    </div>
                    <div  style="font-size: 16px; font-family: system-ui; margin: 20px;">
                        You need to verify your email address to continue using your P Shopping Point account. Enter the following code to verify your email address:
                    </div>
                    <div style="font-size: 25px; font-weight: bolder; font-family: system-ui; margin: 20px;">
                        ${OTP}
                    </div>
                </div>
            </div>`
    }
    transporter.sendMail(mailOptions, (err,info)=>{
        if(err) {
            console.log(err);
            return res.render("emailverification",{navbar:act,action:"LOG OUT",profile: true,file,email,OTPmessage: "Email is invalid",resend:0,ct,cc})
        }
        else {
            console.log("Email has been sent :" , info.response);
            return res.render("emailverification",{navbar:act,action:"LOG OUT",profile: true,email,file,OTPmessage: "OTP Sent Successfully",resend:0,ct,cc})
        }
    });
}

const cart_total = async(req,res) => {
    const user =await data(req,res);
    const itam = await Cart.find({phone:user.phone});
    // console.log(user)
    let total = 0 ;
    let count =0;
    for(let i=0;i<itam.length;i++){
        if(! itam[i].paymet){
            total += (itam[i].prize * itam[i].quantity);
            count += itam[i].quantity;
        }
    }
    let cart_data = [total, count];
    return cart_data;
}

const get_cs = async(ccode, scode) => {
    let config = {
        cUrl : "https://api.countrystatecity.in/v1/countries",
        cKey: "T0k2S0tqcWtsSDdTeURUcWJ4OUJlV1N2WlBqaURFZlU5TnpLdkF5eQ=="
    }

    let add_info = new Array(2);

    await fetch(config.cUrl, {headers : {"X-CSCAPI-KEY" : config.cKey}}).
    then(res => res.json()).
    then(data => {
        data.forEach(ctry => {
            if(ccode == ctry.iso2){
                add_info[0] = ctry.name;
            }
        });
    }).
    catch(err => console.error(err));

    await fetch(`${config.cUrl}/${ccode}/states`, {headers : {"X-CSCAPI-KEY" : config.cKey}}).
    then(res => res.json()).
    then(data => {
        data.forEach(st => {
            if(scode == st.iso2) {
                add_info[1] = st.name;
            }
        });
    }).
    catch(err => console.error(err));
    return add_info;
}

export {
    sendMail,
    sendMailForgot,
    data,
    auth,
    OTP,
    cart_total,
    get_cs
}