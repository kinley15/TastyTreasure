const express = require("express")
require("dotenv").config();
const path = require('path')
const app = express()
var cookieParser = require('cookie-parser')

app.use(express.json())
app.use(cookieParser())
const userRouter = require('./routes/userRoutes')

const recipeRouter = require('./routes/recipeRoutes')

const viewRoutes = require('./routes/viewRoutes')

const commentsRoutes = require('./routes/commentsRoutes')

// const newsRoutes = require('./routes/newsRoutes')


app.use(express.json())
app.use('/api/v1/users',userRouter)

app.use('/api/v1/recipes',recipeRouter)

app.use('/api/v1/comments',commentsRoutes)

app.use('/',viewRoutes)
// app.use('/api/v1/news',newsRoutes)
app.use(express.static(path.join(__dirname, 'views')))



module.exports = app