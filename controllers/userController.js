const User = require('./../models/userModel');
const AppError = require('../utils/appError');
const dotenv = require('dotenv');
const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const mongoose = require('mongoose')

dotenv.config({ path: './config.env' });

const spacesEndpoint = new AWS.Endpoint(process.env.spaceendpoint); // Replace with your Spaces endpoint
const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId: process.env.AccessKey,
  secretAccessKey: process.env.SecretKeySpace ,
});
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      cb(new AppError('Not an image! Please upload only images.', 400), false);
    }
};

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.spacename, // Replace with your bucket name
    acl: 'public-read', // Set ACL to make uploaded images publicly accessible
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + '-' + file.originalname);
    },
  }),
  fileFilter: multerFilter
});

exports.uploadUserPhoto = upload.single('photo');

// Add your other controller methods below...
// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'views/img/users');
//   },
//   filename: (req, file, cb) => {
//     var obj = JSON.parse(req.cookies.token)
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${obj['_id']}-${Date.now()}.${ext}`)
// },
// })


  


const filterObj = (obj, ...allowedFields) => {
    const newObj = {}
    Object.keys(obj).forEach(el => {
      if (allowedFields.includes(el)) newObj[el] = obj[el]
    })
    return newObj
}
  
//   exports.getMe = (req, res, next) => {
//     req.params.id = req.user.id;
//     next();
//   };
exports.updateMe = async (req, res, next) => {
    try {
        // Create error if user POSTs password data
        if (req.body.password || req.body.passwordConfirm) {
            return next(
                new AppError(
                    'This route is not for password updates. Please use /updateMyPassword.',
                    400,
                ),
            );
        }

        // Filter out unwanted fields names that are not allowed to be updated
        const filteredBody = filterObj(req.body, 'name', 'email');
        
        // If a photo was uploaded, update the photo field with the endpoint link
        if (req.file) {
            
            // Construct the endpoint link using the Spaces endpoint and the key (filename) of the uploaded image
            const photoEndpoint = `https://${process.env.spacename}.${process.env.spaceendpoint}/${req.file.key}`;
            // Add the photoEndpoint to the filteredBody
            filteredBody.photo = photoEndpoint;
        }

        // Find the user by ID and update the filteredBody fields
        const obj = JSON.parse(req.cookies.token);
        const updatedUser = await User.findByIdAndUpdate(obj['_id'], filteredBody, {
            new: true,
            runValidators: true,
        });

        // Send the updated user object in the response
        res.status(200).json({
            status: 'success',
            data: {
                user: updatedUser
            }
        });

    } catch (err) {
        // Handle errors
        res.status(500).json({ error: err.message });
    }
};


exports.getAllUsers = async (req, res, next) =>{
    try{
        const users = await User.find()
        res.status(200).json({data: users, status: 'success'})
    }catch(err){
        res.status(500).json({error: err.message});
    }
}

exports.createUser = async (req, res) =>{
    try{
        const user = await User.create(req.body);
        res.json({data: user, status: 'success'});
    }catch(err){
        res.status(500).json({error: err.message});
    }
}

exports.getUser = async (req, res) =>{
    try{
        const user = await User.findById(req.params.id);
        res.json({data: user, status: 'success'});
    }catch(err){
        res.status(500).json({error: err.message});
    }
}

exports.updateUser = async (req, res) =>{
    try{
        const user = await User.findByIdAndUpdate(req.params.id, req.body);
        res.json({data: user, status: 'success'});
    }catch(err){
        res.status(500).json({error: err.message});
    }
}

exports.deleteUser = async (req, res) =>{
    try{
        const user = await User.findByIdAndDelete(req.params.id);
        res.json({data: user, status: 'success'});
    }catch(err){
        res.status(500).json({error: err.message});
    }
}

exports.submitFav = async (req, res) => {
    try {
        const { recipeId, userId } = req.body;

        // Validate the input
        if (!mongoose.Types.ObjectId.isValid(recipeId) || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ status: 'fail', message: 'Invalid ID' });
        }
  
        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ status: 'fail', message: 'Recipe not found' });
        }
  
        // Check if the user has already add to fav
        const existingFav = user.fav.find(r => r.recipeId.toString() === recipeId.toString());
  
        if (existingFav) {
            // Update the existing rating
            const existingFavIndex = user.fav.findIndex(fav => fav.recipeId.toString() === recipeId.toString());
            user.fav.splice(existingFavIndex, 1); // Remove the favorite with matching recipeId

        } else {
            // Add a new rating
            user.fav.push({ recipeId });
        }
      
  
        // Save the updated recipe
        await user.save();
  
  
        res.status(200).json({
            status: 'success',
            data: {
                user
            },
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to submit fav'
        });
    }
  };