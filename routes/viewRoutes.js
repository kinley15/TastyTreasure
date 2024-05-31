const express = require('express')
const router = express.Router()

const viewsController = require('../controllers/viewController')
const authController = require('../controllers/authController')
router.get('/',viewsController.getHome)
router.get('/login',viewsController.getLoginForm)
router.get('/signup',viewsController.getSignupForm)
router.get('/me',viewsController.getProfile,authController.protect)
router.get('/addrecipe',viewsController.addrecipe)
router.get('/recipe-detail',viewsController.recipe_detail)
router.get('/yourpost',viewsController.yourpost)
router.get('/yourfav',viewsController.yourfav)
module.exports = router