const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const favSchema = new mongoose.Schema({
    recipeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipe',
        required: true,
    },
});
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        require:[true,'Please tell us your name'],
    },
    email:{
        type: String,
        require:[true,'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail,'Please provide a valid email'],
    },
    photo:{
        type: String,
        default: 'https://foodbucket.syd1.cdn.digitaloceanspaces.com/WhatsApp%20Image%202024-05-29%20at%202.16.10%20AM.jpeg'
    },
    password:{
        type:String,
        require:[true,'please provide a password!'],
        minlength:8,
        select:false,
    },
    passwordConfirm:{
        type:String,
        require:[true,'Please confirm your password'],
        validator:function (el) {
            return el ==this.password
        },
        message: 'Password are not the same'
    },
    active:{
        type:Boolean,
        default:true,
        select: false,
    },
    fav : [favSchema],
})
userSchema.pre('save',async function(next){

    if(!this.isModified('password'))
    return next()
    this.password = await bcrypt.hash(this.password,12)

    this.passwordConfirm = undefined
    next()
})

userSchema.pre('findOneAndUpdate', async function (next){
    const update = this.getUpdate();
    if (update.password !=='' && update.password !== undefined&& update.password == update.passwordConfirm) {
        this.getUpdate().password = await bcrypt.hash(update.password,12)
        update.passwordConfirm = undefined
        next()
    } else {
        next()
    }
})
userSchema.methods.correctPassword = async function(
    candidatePassword,
    userPassword
){
    return await bcrypt.compare(candidatePassword,userPassword)
}

const User = mongoose.model('User',userSchema)
module.exports = User