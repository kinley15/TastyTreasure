const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
});

const recipeSchema = new mongoose.Schema({
    publishedBy: {
        type: String,
        required: [true, "userName needed"]
    },
    recipeName: {
        type: String,
        required: [true, 'Please provide a recipe name'],
    },
    dishType: {
        type: String,
        enum: ['Main Dish', 'Side Dish', 'Appetizer', 'Soup', 'Salad', 'Dessert', 'Drink'],
        required: [true, 'Please provide a dish type'],
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Moderate', 'Hard'],
        required: [true, 'Please provide the difficulty level'],
    },
    image: {
        type: String,
        required: [true, 'Please provide a dish image'],
    },
    ingredients: {
        type: [String],
        required: [true, 'Please provide the ingredients'],
    },
    directions: {
        type: String,
        required: [true, 'Please provide the directions'],
    },
    ratings: [ratingSchema], // Array of ratings
    averageRating: {
        type: Number,
        default: 0,
    },
    voteCount: {
        type: Number,
        default: 0,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "userId needed"],
    },
});

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
