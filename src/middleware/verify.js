const jwt = require("jsonwebtoken");
const Response = require("../helper/sendResponse");
key = "karan"; //convert to env
const verifyUser = (req,res,next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    if (token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length);
    }
    jwt.verify(token, key, (err, authData) => {
        if (err) {
            // console.log(err)
            return res.send(Response(400, "Session Expired! Please login again", null));
            // return res.status(400).send('Session Expired! Please login again');
        }
        req.context = {user:authData};
    });

    next();
}

module.exports = verifyUser