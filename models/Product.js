const mongoose = require('mongoose');
const User = require('./../models/User');

const ProductSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true,
    },
    desc:{
        type: String,
        required: true
    },
    img:{
        type: String,
    },
    categories:{
        type: Array
    },
    size:{
        type: String,
    },
    color:{
        type: String
    },
    price:{
        type: Number,
        required: true
    },
    // createdBy:{
    //     type: mongoose.Schema.objectId,
    //     ref:"User",
    //     required: true
    // },
},
{timestamps: true}
);

module.exports = mongoose.model("Product", ProductSchema);