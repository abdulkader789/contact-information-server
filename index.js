const express = require('express');
const cors = require('cors');

const dotenv=require('dotenv')
const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true  // Enable credentials (e.g., cookies, authorization headers)
  }));

dotenv.config({path:'./config.env'})
const PORT = process.env.PORT

const cookieParser = require('cookie-parser');
app.use(cookieParser());


require('./db/connect')
app.use(express.json())

// const User = require('./model/userSchema')
app.use(require('./router/auth'))



// app.get("/",(req, res)=>{
//     res.send("Welcome to home page")
// })

// app.get("/contact",(req, res)=>{
//     res.send("Welcome to contact page")
// })
// app.get("/register",(req, res)=>{
//     res.send("Welcome to register page")
// })
// app.get("/login",(req, res)=>{
//     res.send("Welcome to login page")
// })


app.listen(PORT,()=>{
    console.log(`SERVER IS ON ${PORT}`)
})

