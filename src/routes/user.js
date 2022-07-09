const express = require("express");
const user = require("../models/user.js");
const router = express.Router();
const bcrypt = require("bcrypt");
const createToken = require("../middleware/createToken");
const axios = require('axios');
const returnAuthTemplate = require("../templates/authlink.js");
router.get('/', async (req, res) => {
    const temp = returnAuthTemplate("link hai ye")
    console.log(temp);
    const mailOptions = {
        "from": "'Diary' <d@gmail.com>",
        "to": "karan.@gmail.com",
        "subject": "Account Activation",
        "html": temp
    }
    axios.post("https://scintillating-daffodil-156dbb.netlify.app/.netlify/functions/helloworld", { mailOptions: mailOptions })
        .then(() => {
        })
        .catch((err) => {
            console.log(err);
        })
    res.status(201).send("User Created");
})
// TO VERIFY USER USING MAIL SERVICE.
// USER SHOULD CLICK ON LINK TO HIT THE API THEN THE USER WILL BE AUTHENTICATED TO SIGN IN
router.get("/verify/:id", async (req, res) => {
    // http://localhost:5000/user/verify/62c7ee4baa5979537ae904b0
    const _id = req.params.id;
    const userData = await user.updateOne({ _id }, { isActive: true }).exec();
    if (userData == null)
        return res.status(404).send("Invalid Authentication Found!!");
    if (userData.modifiedCount == 0)
        return res.status(204).send("Authentication Already Done.")

    console.log(_id, "User Authentication Successful");

    res.status(200).send("User Authentication Successful");
})

router.post("/login", async (req, res) => {
    let { email, username, password } = { ...req.body };

    let userData = await user.findOne({
        $or: [
            { email },
            { username }
        ]
    }).exec()

    if (userData == null)
        return res.status(404).send("User Not Found");
    if (userData.isActive == false)
        return res.status(401).send("ID not activated. Please Check Mail");

    userData = userData.toJSON();
    bcrypt.compare(password, userData.password)
        .then((bool) => {
            if (bool === true) {
                console.log("Logged in");
                const token = createToken(userData);
                const obj = { ...userData, token };
                return res.status(200).send(obj);
            }
            else
                return res.status(401).send("Wrong Password");
        })
        .catch((err) => {
            return res.status(500).send("Something Went Wrong With HashCheck");
        })
})

router.post("/signup", (req, res) => {
    // console.log(req.body);
    let { email, username, password, name } = { ...req.body };
    // Checking if username OR email is taken
    user.findOne({
        $or: [
            { email },
            { username }
        ]
    })
        .then((data) => {
            console.log(data);
            if (data && data.username == username) {
                console.log("Username Already Taken");
                return res.status(409).send("Username Taken");
            }
            if (data && data.email == email)
                return res.status(409).send("Email Taken");
            else {
                // Hashing password and creating new account
                bcrypt.hash(password, 5)
                    .then(async (hash) => {
                        await user.create({ email, username, password: hash, name })
                            .then((userData) => {
                                console.log("user created");
                                // let resp = sendMail(userData.email, userData._id);
                                const mailOptions = {
                                    "from": "'Diary' <d@gmail.com>",
                                    "to": userData.email,
                                    "subject": "Account Activation",
                                    "text": `Hi ${userData.name},\n\nPlease click on the following link to activate your account: \nhttp://localhost:3000/verify/${userData._id}`,
                                    "html" : returnAuthTemplate(`http://localhost:3000/verify/${userData._id}`)

                                }
                                axios.post("https://scintillating-daffodil-156dbb.netlify.app/.netlify/functions/helloworld", { mailOptions: mailOptions })
                                    .then(() => {
                                    })
                                    .catch((err) => {
                                        console.log(err);
                                    })
                                res.status(201).send("User Created");
                            })
                            .catch((err) => {
                                console.log(err);
                                res.status(500).send("Internal Server Error");
                            });
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).send("Problem hashing password");
                    });
            }
        })
        .catch((err) => {
            return res.status(500).send("Something Went Wrong");
        });
})

module.exports = router;
