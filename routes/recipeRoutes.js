const expres = require('express')
const recipeController = require('./../controllers/recipeController')

const routes = expres.Router()

routes.post('/post',recipeController.uploadRecipePhoto, recipeController.createRecipe)

routes.get('/',recipeController.getAllRecipes)

routes.get('/:id',recipeController.getRecipe)

routes.post('/rate', recipeController.submitRating);

routes
    .route('/:id')
    .get(recipeController.getRecipe)
    .patch(recipeController.updateRecipe)
    .delete(recipeController.deleteRecipe)
// Calculate average rating route
// routes.get('/:Id/averageRating', recipeController.calculateAverageRating);

module.exports = routes