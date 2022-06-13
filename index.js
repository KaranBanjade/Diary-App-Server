const app = require('./app');
const dotenv = require("dotenv");
dotenv.config();

const port = process.env.port||5000;

app.listen(port, ()=>{
    console.log("Server Started", port);
})