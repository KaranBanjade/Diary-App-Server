const express = require('express');
const cors = require('cors');
const verifyUser = require("./src/middleware/verify")
const router = express.Router();
//Creating an HTTP server
const app = express();

// Dealing with cors errors
app.use(cors());
// making sure that the responses are in json
app.use(express.json());

// Exposing Routes
const diaryRoutes = require("./src/routes/diary")
const userRoutes = require("./src/routes/user")

app.use("/diary/",verifyUser,diaryRoutes);
app.use("/user/",userRoutes);

// Establishing DB Connection
require("./src/db/conn");

module.exports = app;