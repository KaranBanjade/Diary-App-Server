const express  = require("express");
const user = require("../models/user.js");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const createToken = require("../middleware/createToken")

// TO VERIFY USER USING MAIL SERVICE.
// USER SHOULD CLICK ON LINK TO HIT THE API THEN THE USER WILL BE AUTHENTICATED TO SIGN IN
router.get("/verify/:id", async(req,res) => {
    const _id = req.params.id;
    const userData = await user.updateOne({_id},{isActive:true}).exec();
    if(userData == null)
        return res.send("Invalid Authentication Found!!");
    if(userData.modifiedCount==0)
        return res.send("Authentication Already Done.")

    console.log(_id, "User Authentication Successful");

    res.send("User Authentication Successful");
})

router.post("/login",async(req,res)=>{
    let {email, username, password} = {...req.body};

    let userData = await user.findOne({ $or:[
        {email},
        {username}
    ]}).exec()
    // CONVERTING MONGOOSE OBJECT TO JSON
    
    if(userData == null)
        return res.send("User Not Found");
    if(userData.isActive == false)
        return res.send("ID not activated. Please Check Mail");
    
    userData = userData.toJSON();
    bcrypt.compare(password,userData.password, (err,result)=>{
        if(err){
            return res.send("Wrong Password");
        }
        if(result){
            console.log("Logged in");
            const token = createToken(userData);
            const obj = {...userData, token};
            return res.send(obj);
        }
    })

})

router.post("/signup", (req,res)=>{
    let {email, username, password, name} = {...req.body};
    // Checking if username OR email is taken
    user.findOne({ $or:[
        {email},
        {username}
    ]})
    .exec((err, data)=>{
        if(data.username == username) 
            return res.send("Username Taken");
        if(data.email == email)
            return res.send("Email Taken");
    });
    
    // Hashing password and creating new account
    bcrypt.hash(password, 5)
    .then(async(hash)=>{
        await user.create({email,username,password:hash,name})
        .then(()=>{
            console.log("user created");
            res.send("Created");
        })
        .catch((err) => {
            console.log(err);
            res.send("not Created");
        });
    })
    .catch(err=>{
        console.log(err);
        res.send("Problem hashing password");
    });
})

module.exports = router;
