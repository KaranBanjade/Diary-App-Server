const express = require('express');
const mongoose = require('mongoose');
let conString  = "diary";
console.log("trying to connect");
const connectMongoose = async() => {
        const db = await mongoose.connect(`mongodb://127.0.0.1:27017/${conString}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("connected");
}
connectMongoose();