const { JsonWebTokenError } = require('jsonwebtoken')
const User =  require('./../models/userModel')
const jwt = require('jsonwebtoken')
const { promisify } =  require('util')
const AppError = require('./../utils/appError')

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    })
}
const createSendToken = (user, statusCode,res) => {
    const token = signToken(user._id)
    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
        ),
        httpOnly:true,
    }
    res.cookie("jwt" , token, cookieOptions)
    
    res.status(statusCode).json({
        status: "success",
        token,
        data : {
            user
        }
    })
}
exports.signup = async (req, res, next) => {
    try {
        // Check if email already exists
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        // Create new user
        const newUser = await User.create(req.body);
        const token = signToken(newUser._id);

        res.status(201).json({
            status: 'success',
            token,
            data: {
                user: newUser
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body

        if(!email || !password) {
            return next(new AppError('Please provide an email and password!', 400))
        }
        const user = await User.findOne({ email }).select('+password')
        //const correct = await user.correctPassword(password, user.password)

        if (!user || !(await user.correctPassword(password, user.password))) {
            return next(new AppError('Incorrect email or password',401))
        }
        createSendToken(user, 200, res)
        // const token = signToken(user._id)
        // res.status(200).json({
        //     status: 'success',
        //     token,
        // })

    } catch (err) {
        res.status(500).json({error: err.message });

    }
}
exports.protect = async (req, res, next) => {
    try{
        //Getting token and check of its there

        let token
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1]
        }
        else if (req.cookies.jwt) {
            token = req.cookies.jwt
        }
        if(!token) {
            return next(
                new AppError('You are not logged in! PLease log in to get access', 401),
            )
        }

        //verification token 
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)

        //check if user still exists
        const freshUser = await User.findById(decoded.id);
        if(!freshUser) {
            return next(
                new AppError('THe user belonging to this token is no longer exist', 401),
            )
        }
        //Grant access to protected route
        req.user = freshUser;
        next()
    }
    catch(err) {
        res.status(500).json({ error: err.message });
    }
}
exports.updatePassword = async (req, res, next) => {
    try{
        //get user from collection
        const user = await User.findById(req.user.id).select('+password')
        // check if poste current password is correct
        if(!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
            return next(new AppError('Your current password is wrong',401))
        }
        //if so,update password
        user.password = req.body.password
        user.passwordConfirm = req.body.passwordConfirm
        await user.save()
        //log user in,send JWT
        createSendToken(user,200,res)
    }
    catch(err){
        res.status(500).json({error: err.message});
    }

}
exports.restrictTo = (...roles) => {
    return (req, res, next) => {
      // roles ['admin', 'lead-guide']. role='user'
      if (!roles.includes(req.user.role)) {
        return next(
          new AppError('You do not have permission to perform this action', 403)
        )
      }
  
      next()
    }
  }  

exports.logout = (req, res) => {
    res.cookie('token', '', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,

    })
    res.status(200).json({ status: 'success' })
} 