import nodemailer from "nodemailer";
import express from "express";
import dotenv from "dotenv"
import jwt from "jsonwebtoken"
import { User } from "../models/userModel.js";

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
                user:"parthpipaliya1112@gmail.com",
                pass:"yixtqrmfmuxjfxiq"
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

const sendMail = async (name,email,req,res,file,act) => {
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
            return res.render("emailverification",{navbar:act,action:"LOG OUT",profile: true,file,email,OTPmessage: "Email is invalid",resend:0})
        }
        else {
            console.log("Email has been sent :" , info.response);
            return res.render("emailverification",{navbar:act,action:"LOG OUT",profile: true,email,file,OTPmessage: "OTP Sent Successfully",resend:0})
        }
    });
}

export {
    sendMail,
    sendMailForgot,
    data,
    auth,
    OTP
}