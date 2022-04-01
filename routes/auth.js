const router = require('express').Router();
const User = require('./../models/User');
const cryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require("./../mail/SendEmail");


//Register User
router.post("/register", async(req, res)=>{
    const newUser = new User({
        name:req.body.name,
        email: req.body.email,
        password: cryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString(),
    });
    try{
        const savedUser = await newUser.save();
        const {password, ...others} = savedUser._doc;
        res.status(201).json(others);

    }catch(err){
        res.status(500).json(err);
    }
});

//Login
router.post("/login", async (req, res)=>{
    try{
        const user = await User.findOne({email: req.body.email});

        !user && res.status(403).json('Wrong credentials.');

        const hashedPassword = cryptoJS.AES.decrypt(user.password, process.env.PASS_SEC);
        const originalPassword = hashedPassword.toString(cryptoJS.enc.Utf8);

        !originalPassword && res.status(403).json('Wrong Credentials.');

        //creating jwt
        const token = jwt.sign({id:user._id}, process.env.JWT_SEC, {expiresIn:"5d"});

        //Saving token in cookie
        //options for cookie
        const options = {
            expires: new Date(Date.now() + process.env.COOKIE_EXPIRE *24*60*60*1000),
            httpOnly: true,
        };

        const {password, ...others} = user._doc;
        res.status(200).cookie("token", token, options).json({...others, token});

    }catch(err){
        res.status(500).json(err);
    }
});

//Logout
router.get("/logout", (req, res)=>{
    try{
        res.cookie("token", null, {
            expires: new Date(Date.now()),
            httpOnly: true,
        });
        res.status(200).json("Loggedout")
    }catch(err){
        res.status(500).json(err);
    }
});

//Forgot Password
router.post("/password/forgot", async (req, res)=>{
    try{
        const user = await User.findOne({email: req.body.email});
        if(!user){
            res.status(404).json("User not found");
        }
        //Generating password reset token and store in database
        const resetToken = crypto.randomBytes(20).toString('hex');

        //Hashing resetToken
        user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
        user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
        //adding resetpassword token to user schema
        await user.save({validateBeforeSave: false});
        //Creating reset Password Url
        const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/auth/password/reset/${resetToken}`;
        const message = `Your rest password token is \n ${resetPasswordUrl} \n \n`

        //Sending resetPasswordUrl using gmail
        try{
            await sendEmail({
                email: user.email,
                subject: 'Ecommerece password Recovery.',
                message,
            });
            res.status(200).json(`Email sent to ${user.email} successfully.`);

        }catch(err){
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({validateBeforeSave: false});
            res.status(500).json(err);
        };

    }catch(err){
        res.status(500).json(err);
    }
});

//Reset Password
router.put("/password/reset/:token", async(req, res)=>{
    try{
        //creating token hash
        const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
        const user = await User.findOne({resetPasswordToken, resetPasswordExpire:{$gt:Date.now()}});

        !user && res.status(400).json("Reset password token is invalid or expired.")

        if(req.body.password === req.body.confirmPassword){
            user.password = cryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString();
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({validateBeforeSave: false});
            const {password, ...others} = user._doc;
            res.status(200).json(others);               
        }; 
        res.status(400).json("Password and confirmPassword doesnot match."); 
    }catch(err){
        
    }                 
});

module.exports = router;