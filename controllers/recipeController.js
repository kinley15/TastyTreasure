const Recipe = require('./../models/recipeModel');
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

exports.uploadRecipePhoto = upload.single('image');

const filterObj = (obj, ...allowedFields) => {
    const newObj = {}
    Object.keys(obj).forEach(el => {
      if (allowedFields.includes(el)) newObj[el] = obj[el]
    })
    return newObj
}
  
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


exports.getAllRecipes = async (req, res, next) =>{
    try{
        const recipes = await Recipe.find()
        res.status(200).json({data: recipes, status: 'success'})
    }catch(err){
        res.status(500).json({error: err.message});
    }
}

exports.createRecipe = async (req, res) =>{
    try{
        const {userId,publishedBy, recipeName, dishType, difficulty, ingredients, directions, rating, voteCount} = req.body;
        const image = req.file.location;
        const user = {userId, publishedBy, recipeName, dishType, difficulty, image, ingredients, directions, rating, voteCount};
        const recipes = await Recipe.create(user);
      
        res.json({data: recipes, status: 'success'});
    }catch(err){
        res.status(500).json({error: err.message});
    }
}

exports.getRecipe = async (req, res) =>{
    try{
        const recipe = await Recipe.findById(req.params.id);
        res.json({data: recipe, status: 'success'});
    }catch(err){
        res.status(500).json({error: err.message});
    }
}

exports.updateRecipe = async (req, res) =>{
    try{
        const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body);
        res.json({data: recipe, status: 'success'});
    }catch(err){
        res.status(500).json({error: err.message});
    }
}

exports.deleteRecipe = async (req, res) =>{
    try{
        const recipe = await Recipe.findByIdAndDelete(req.params.id);
        const usersWithDeletedRecipe = await User.find({ fav: { $elemMatch: { recipeId: req.params.id } } });

        // Remove the deleted recipe from the favorites of each user
        const updatePromises = usersWithDeletedRecipe.map(async (user) => {
          const existingRecIndex = user.fav.findIndex(fav => fav.recipeId.toString() === req.params.id.toString());
          user.fav.splice(existingRecIndex, 1); // Remove the favorite with matching recipeId
          await user.save();
        });

        // Wait for all updates to complete
        await Promise.all(updatePromises);
        res.json({data: recipe, status: 'success'});
    }catch(err){
        res.status(500).json({error: err.message});
    }
}
exports.submitRating = async (req, res) => {
  try {
      const { recipeId, rating, userId } = req.body;

      // Validate the input
      if (!mongoose.Types.ObjectId.isValid(recipeId) || !mongoose.Types.ObjectId.isValid(userId)) {
          return res.status(400).json({ status: 'fail', message: 'Invalid ID' });
      }

      // Find the recipe by ID
      const recipe = await Recipe.findById(recipeId);
      if (!recipe) {
          return res.status(404).json({ status: 'fail', message: 'Recipe not found' });
      }

      // Check if the user has already rated this recipe
      const existingRating = recipe.ratings.find(r => r.userId.toString() === userId.toString());

      if (existingRating) {
          // Update the existing rating
          existingRating.rating = rating;
      } else {
          // Add a new rating
          recipe.ratings.push({ userId, rating });
      }
      const sum = recipe.ratings.reduce((acc, curr) => acc + curr.rating, 0);
      
      const averageRating = sum / recipe.ratings.length;
      recipe.averageRating = averageRating;

      // Save the updated recipe
      await recipe.save();


      res.status(200).json({
          status: 'success',
          data: {
              averageRating: averageRating.toFixed(1)
          }
      });
  } catch (err) {
      res.status(500).json({
          status: 'error',
          message: 'Failed to submit rating'
      });
  }
};
// Endpoint to update rating
exports.updateRating = async (req, res) => {
    try {
      const { recipeId, rating } = req.body;
      // const userId = req.user._id; // Assuming you have authenticated users
      // Find the recipe by ID
      const recipe = await Recipe.findById(recipeId);
  
      // Check if user has already rated the recipe
      const existingRating = recipe.ratings.find(r => r.userId.toString() === userId.toString());
      if (existingRating) {
        // Update the existing rating
        existingRating.rating = rating;
      } else {
        // Add the new rating to the ratings array
        recipe.ratings.push({ userId, rating });
        recipe.voteCount += 1; // Increment the vote count
      }
  
      // Recalculate the average rating
      const sum = recipe.ratings.reduce((acc, curr) => acc + curr.rating, 0);
      recipe.averageRating = sum / recipe.ratings.length;
  
      // Save the updated recipe
      await recipe.save();
  
      res.status(200).json({
        status: 'success',
        message: 'Rating updated successfully',
        data: {
          averageRating: recipe.averageRating,
          voteCount: recipe.voteCount,
        }
      });
    } catch (err) {
      res.status(500).json({
        status: 'error',
        message: 'Failed to update rating',
        error: err.message,
      });
    }
  };
  
  // Calculate average rating
  exports.calculateAverageRating = async (req, res) => {
    try {
      const { recipeId } = req.params;
  
      // Find the recipe by ID
      const recipe = await Recipe.findById(recipeId);
  
      // Calculate the average rating
      const sum = recipe.ratings.reduce((acc, curr) => acc + curr.rating, 0);

      const averageRating = sum / recipe.ratings.length;
  
      res.status(200).json({
        status: 'success',
        data: {
          averageRating,
          ratingsCount: recipe.ratings.length,
          ratedBy: recipe.ratings,
        }
      });
    } catch (err) {
      res.status(500).json({
        status: 'error',
        message: 'Failed to calculate average rating',
        error: err.message,
      });
    }
  };