const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

key = "karan"; //convert to env
const verifyUser = (req,res,next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    if (token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length);
    }
    jwt.verify(token, key, (err, authData) => {
        if (err) {
            console.log(err)
            return res.send('Session Expired! Please login again');
        }
        req.context = {user:authData};
    });

    next();
}

module.exports = verifyUser