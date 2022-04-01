const express = require('express');
const router = express.Router();
const Product = require('./../models/Product');
const {isAuthenticatedUser, authorizedRole} = require('./verifyToken');

//Create new product
router.post("/new", isAuthenticatedUser, authorizedRole("admin"), async (req, res)=>{
    const newProduct = new Product({
        name: req.body.name,
        desc: req.body.desc,
        categories: req.body.categories,
        size: req.body.size,
        color:req.body.color,
        price: req.body.price
    });
    try{
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct)

    }catch(err){
        res.status(500).json(err);
    }
});

//Update product
router.put("/edit/:id",isAuthenticatedUser,authorizedRole("admin"), async(req, res)=>{
    try{
        const updatedproduct = await Product.findByIdAndUpdate(req.params.id,{$set: req.body},{new:true});
        res.status(200).json(updatedproduct);

    }catch(err){
        res.status(500).json(err);
    }
});

//Get all products
router.get("/all", async (req, res)=>{
    try{
        const allProducts = await Product.find();
        res.status(200).json(allProducts);

    }catch(err){
        res.status(500).json(err);
    }
});

//Get Product
router.get("/:id", async (req, res)=>{
    try{
        const product = await Product.findById(req.params.id);
        res.status(200).json(product);

    }catch(err){
        res.status(500).json(err);
    }
});

//Delete product
router.delete("/delete/:id", isAuthenticatedUser,authorizedRole("admin"), async (req, res)=>{
    try{
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json("Product has been deleted successfully.");
    }catch(err){
        res.status(500).json(err);
    }
});

module.exports = router;