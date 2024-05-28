const express = require("express");

const app = express();

require('dotenv').config()

const PORT = process.env.PORT;

app.get('/login', (req,res)=>{
    return res.status(200).json({
        message:"Trail",
    });
})


app.get('/register', (req,res)=>{
    return res.status(200).json({
        message:"Trail register",
    });
})

app.get('/', (req,res)=>{
    return res.status(200).json({
        message:"Trail Index",
    });
})

app.listen(PORT, () =>{
    console.log(`running on ${PORT}`);
});