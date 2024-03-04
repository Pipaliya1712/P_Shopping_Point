import express from "express";
import bodyparser from "body-parser";
const app = express();

app.use(bodyparser.urlencoded({extended:false}));

const authnot = async (req,res,next) => {
    const {token} = req.cookies;
    if(token) next();
    else res.redirect("/");
}

const authentication = async (req,res,next) => {
    const {token} = req.cookies;
    if(token) res.redirect("/");
    else next();
}

export {
    authnot,
    authentication
}