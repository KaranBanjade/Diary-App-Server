const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

key = "karan";

const createToken = (userData) => {
    const token= jwt.sign( 
        {
            email:userData.email,
            username:userData.username,
            userID:userData._id,
        },
        key,
        {
            expiresIn:"1h"
        }
    );
    return ("Bearer " + token);
}
module.exports = createToken