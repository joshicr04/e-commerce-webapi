const router = require('express').Router();
const User = require('./../models/User');
const cryptoJS = require('crypto-js');
const {isAuthenticatedUser, authorizedRole} = require('./verifyToken');

//Update user --admin
router.put("/edit/:id", isAuthenticatedUser, authorizedRole("admin"), async(req, res)=>{
    if(req.body.password){
        req.body.password = cryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString();
    }
    try{
        const updatedUser = await User.findByIdAndUpdate(req.params.id, 
            {$set:req.body}, {new: true});
        res.status(200).json(updatedUser);

    }catch(err){
        res.status(500).json(err);
    }
});

//Delete
router.delete("/delete/:id", isAuthenticatedUser, async(req, res)=>{
    try{
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User has been deleted successfully.");

    }catch(err){
        res.status(500).json(err);
    }
});

//Get all user --admin
router.get("/all", isAuthenticatedUser, authorizedRole("admin"), async(req, res)=>{
    try{
        const users = await User.find();
        res.status(200).json(users);

    }catch(err){
        //res.status(500).json(err);
    }
});

//Get Single User --admin
router.get("/admin/:id", isAuthenticatedUser, authorizedRole("admin"), async(req, res)=>{
    try{
        const user = await User.findById(req.params.id);
        !user && res.status(404).json(`User doesnot exist with id: ${req.params.id}`);

        res.status(200).json(user);

    }catch(err){
        res.status(500).json(err);
    }
});

//Get User Details
router.get("/me", isAuthenticatedUser, async(req, res)=>{
    try{
        const user = await User.findById(req.user.id);
        res.status(200).json(user);

    }catch(err){
        res.status(500).json(err);
    }
})

module.exports = router;