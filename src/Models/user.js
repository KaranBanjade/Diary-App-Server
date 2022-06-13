const mongoose = require('mongoose');
const validator = require("validator");

const userSchema = new mongoose.Schema({
    username: {
        type: 'string',
        require: true,
        unique: [true,"Email id already present"],
        validate(value){
            if(value.length<3)
                throw new Error("ENTER ATLEAST 3 Chars!");
            if(!isNaN(value[0]))
                throw new Error("USERNAME SHOULD NOT START WITH NUMBER");
        }
    },
    name: {
        type: 'string',
        require: true
    },
    email: {
        type: 'string',
        require: true,
        unique: [true,"Email id already present"],
        validate(value){
            if(!validator.isEmail(value))
                throw new Error("INVALID EMAIL!")
        }
    },
    password:{
        type: 'string',
        require: true
    },
    isActive: {
        type: 'boolean',
        default: false
    },
    diaries: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "diary"
    }]
});
const user = mongoose.model("user", userSchema)
module.exports = user;
