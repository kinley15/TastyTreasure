const path = require('path')

exports.getLoginForm = (req,res)=>(
    res.sendFile(path.join(__dirname,'../','views','login.html'))
)

exports.getSignupForm = (req,res)=>{
    res.sendFile(path.join(__dirname,'../','views','signup.html'))
}

exports.getHome = (req,res)=>{
    res.sendFile(path.join(__dirname,'../','views','dashboard.html'))
}


exports.getProfile = (req,res)=>{
    res.sendFile(path.join(__dirname,'../','views','myprofilepage.html'))
}
exports.addrecipe = (req,res)=>{
    res.sendFile(path.join(__dirname,'../','views','addRecipe.html'))
}
exports.recipe_detail = (req,res)=>{
    res.sendFile(path.join(__dirname,'../','views','details.html'))
}

exports.yourpost = (req,res)=>{
    res.sendFile(path.join(__dirname,'../','views','yourpost.html'))
}
exports.yourfav = (req,res)=>{
    res.sendFile(path.join(__dirname,'../','views','yourfav.html'))
}