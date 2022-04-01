const jwt = require('jsonwebtoken');
const User = require('./../models/User');
exports.isAuthenticatedUser = async(req, res, next)=>{
    try{
        const token = req.cookies.token;
        if(!token){
            res.status(401).json("Please login to access this resource.")
        };
        const decodedData = jwt.verify(token, process.env.JWT_SEC);
        req.user = await User.findById(decodedData.id);
        next();
    }catch(err){
        //res.status(500).json(err);
    }
   
};

exports.authorizedRole = (...roles)=>{
    return(req, res, next)=>{
        if(!roles.includes(req.user.role)){
            res.status(403).json(`Role: ${req.user.role} is not allowed to access this resource.`);         
        }       
        next(); 
    };
};
