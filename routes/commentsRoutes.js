const expres = require('express')
const commentsController = require('./../controllers/commentsController')

const routes = expres.Router()

routes.post('/post',commentsController.createComments)

routes.get('/',commentsController.getAllComments)



module.exports = routes