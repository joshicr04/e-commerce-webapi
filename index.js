const express = require('express');
require('dotenv').config({path: ".env"});
const mongoose = require('mongoose');
const cK = require('cookie-parser');

const app = express();
app.use(express.json());
app.use(cK());


const productRoute = require("./routes/product");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const cookieParser = require('cookie-parser');
app.use("/api/product", productRoute);
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);

//Creating Server
app.listen(process.env.PORT || 3030, ()=>{
    console.log(`Server is working on port ${process.env.PORT}`);
});

//Creating database connection
mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true})
.then((data)=>{
    console.log(`MongoDb connected with server...`);
}).catch((err)=>{
    console.log(err);
})