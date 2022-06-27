const express  = require("express");
const user = require("../models/user.js");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const createToken = require("../middleware/createToken");
const axios =  require('axios');
const nodemailer = require("nodemailer");
const {google} = require("googleapis")
router.get('/', async(req, res) => {

    const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
    oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN })
    const mailOptions = {
                from: "",
                to: "@gmail.com",
                subject: "Thankyou for your contribution",
                text:"Hi"
            }
    try{
        const ACCESS_TOKEN = await oAuth2Client.getAccessToken()
        const transport = nodemailer.createTransport({
            service: 'gmail',
            port: 587,
            auth: {
                type: 'OAuth2',
                user: "",
                clientId: CLIENT_ID,
                clientSecret : CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken : ACCESS_TOKEN
            },
            tls: {
                rejectUnauthorized: false
            }
        })
        const result = await transport.sendMail(mailOptions);
        console.log(result);
    }
    catch(error){
        console.log(error);
    }
    return {
        "statusCode": 200,
        "body": JSON.stringify({
            "message" : "hey"
        })
    };
    })
// TO VERIFY USER USING MAIL SERVICE.
// USER SHOULD CLICK ON LINK TO HIT THE API THEN THE USER WILL BE AUTHENTICATED TO SIGN IN
router.get("/verify/:id", async(req,res) => {
    const _id = req.params.id;
    const userData = await user.updateOne({_id},{isActive:true}).exec();
    if(userData == null)
        return res.status(404).send("Invalid Authentication Found!!");
    if(userData.modifiedCount==0)
        return res.status(204).send("Authentication Already Done.")

    console.log(_id, "User Authentication Successful");

    res.status(200).send("User Authentication Successful");
})

router.post("/login",async(req,res)=>{
    let {email, username, password} = {...req.body};

    let userData = await user.findOne({ $or:[
        {email},
        {username}
    ]}).exec()
    
    if(userData == null)
        return res.status(404).send("User Not Found");
    if(userData.isActive == false)
        return res.status(401).send("ID not activated. Please Check Mail");

    userData = userData.toJSON();
    bcrypt.compare(password,userData.password)
    .then((bool)=>{
        if(bool === true){
            console.log("Logged in");
            const token = createToken(userData);
            const obj = {...userData, token};
            return res.status(200).send(obj);
        }
        else
            return res.status(401).send("Wrong Password");
    })
    .catch((err)=>{
        return res.status(500).send("Something Went Wrong With HashCheck");
    })
})

router.post("/signup", (req,res)=>{
    console.log(req.body);
    let {email, username, password, name} = {...req.body};
    // Checking if username OR email is taken
    user.findOne({ $or:[
        {email},
        {username}
    ]})
    .exec((err, data)=>{
        if(data && data.username == username) 
            return res.status(409).send("Username Taken");
        if(data && data.email == email)
            return res.status(409).send("Email Taken");
    });
    
    // Hashing password and creating new account
    bcrypt.hash(password, 5)
    .then(async(hash)=>{
        await user.create({email,username,password:hash,name})
        .then((userData)=>{
            console.log("user created");
            // let resp = sendMail(userData.email, userData._id);
            res.status(201).send("User Created");
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Internal Server Error");
        });
    })
    .catch(err=>{
        console.log(err);
        res.status(500).send("Problem hashing password");
    });
})

module.exports = router;
