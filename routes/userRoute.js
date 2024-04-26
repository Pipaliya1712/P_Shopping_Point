import express from "express";
import * as Controller from "../controllers/userController.js";
import {authentication,authnot} from "../middleware/isAuth.js";
import multer from "multer";
import {data} from "../functions/helper.js"
import path from "path";

const app = express();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,path.join(path.resolve(),"public/Uploads"));                   //path name will change
    },
    filename:async (req,file,cb) => {
        const user = await data(req);
        const currentdate = new Date();
        const fileName = currentdate.getDate() + "-"+ (currentdate.getMonth()+1)  + "-" + currentdate.getFullYear() + "-"  + currentdate.getHours() + "-"  + currentdate.getMinutes() + "-" + currentdate.getSeconds()+'-'+user.name;
        cb(null,fileName);
    },
});

const upload = multer({storage : storage});

const router = express.Router();

router.route("/changePassword").post(Controller.changePassword)
router.route("/forgotPassword").post(Controller.forgotPasswoerdPost).get(authentication,Controller.forgotPasswoerdGet)
router.route("/sendotp").post(Controller.sendotp)
router.route("/emailverification").post(Controller.emailverificationPost)
router.route("/profile").get(authnot,Controller.profileGet).post(Controller.profilePost)
router.route('/edit').get(authnot,Controller.editGet).post(upload.single('file'),Controller.editPost)
router.route("/contact").post(Controller.contactPost).get(Controller.contactGet)
router.route("/about").get(Controller.aboutGet)
router.route("/buyblazer").get(Controller.buyblazerGet)
router.route("/").get(Controller.Get);
router.route("/signup").post(authentication,Controller.signUpPost).get(authentication,Controller.signUpGet)
router.route("/men").get(Controller.menGet)
router.route("/product").get(Controller.producGet).post(Controller.producPost)
router.route("/login").post(authentication,Controller.logInPost).get(authentication,Controller.logInGet)
router.route("/women").get(Controller.womenGet)
router.route("/logout").post(Controller.logOut);
router.route("/cart").get(authnot,Controller.cartGet).post(Controller.cartPost);
router.route("/checkout").get(authnot,Controller.checkoutGet)
router.route("*").get(Controller.randomUrl);


export {router};