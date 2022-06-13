const express = require('express');
const mongoose = require('mongoose');
let conString  = "diary";
console.log("trying to connect");
mongoose.connect(`mongodb://localhost:27017/${conString}`).then(()=>console.log("*****DB Connected****"));