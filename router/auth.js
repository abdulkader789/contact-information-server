const express = require('express');
const router =express.Router();
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const authenticate = require('../middleware/authenticate')
require('../db/connect')

const User = require('../model/userSchema')

router.get('/',(req,res)=>{
    res.send("homepage from router");
})

router.post('/register',async(req,res)=>{
    const {name,email,phone,password,cpassword}=req.body
    if(!name || !email || !phone || !password || !cpassword){
        return res.status(422).json({error:"please fill the information"})
    }
    try{
        const userExist = await User.findOne({email:email});
        if(userExist){
            return res.status(422).json({error:"user already exists"})
        }else if(password !== cpassword){
            return res.status(422).json({error:"password are not matching"})
        }else{
            const user = new User({name,email,phone,password,cpassword})
            await user.save()
            res.status(201).json({message:"user registered successfully"})

        }

        
    }catch(error){
        console.error(error.message);
        res.status(500).json({ error: "Server Error" });
    }
    
   
})

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Fill in all the fields." });
        }

        const userLogin = await User.findOne({ email: email });

        if (userLogin) {
            const isMatch = await bcrypt.compare(password, userLogin.password);
            if (isMatch) {
                const token = await userLogin.generateAuthToken();
                res.cookie('jwtoken', token, {
                    expires: new Date(Date.now() + 25892000000),
                    httpOnly: true,
                    domain: 'localhost' // or your domain name, e.g., 'example.com'
                });
                res.json({ message: "User login successful" });
            } else {
                res.status(400).json({ error: "Invalid password" });
            }
        } else {
            res.status(400).json({ error: "Invalid user" });
        }

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Server Error" });
    }
});

router.get("/about", authenticate, (req, res)=>{
    console.log("this is about page")
    res.send(req.rootUser)
});

router.get("/getdata", authenticate, (req, res)=>{
    console.log("this is about page")
    res.send(req.rootUser)
});

router.post("/contact",authenticate, async(req, res)=>{
    try{
        const {name, email, phone, message} = req.body;
        if(!name || !email || !phone || !message){
            console.log("error in contact form");
            return res.json({error: "fill the contact form"})
        }
        // const userContact = await User.findOne({_id:req.userID})
        const userContact = req.rootUser;

        if(userContact){
            const userMessage = await userContact.addMessage(name, email, phone, message);
            await userContact.save();
            res.status(201).json({message: "user contact successfully"})
        }

    }catch(err){
        console.log(err)
    }
})

router.get('/logout', async (req, res)=>{
    res.clearCookie('jwtoken', {path:'/'})
    res.status(200).send('user logout')
})
module.exports=router;






  









