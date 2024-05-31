const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config({ path: './config.env' })
const app = require('./app')

const DB = process.env.DATABASE.replace(
    'PASSWORD',
    process.env.DATABASE_PASSWORD,
)

mongoose.connect(DB).then((con)=>{
    console.log('DB connection successful')
}).catch(error => console.log(error)); 


// starting the server on port 4001.

const port = 8080
app.listen(port, () => {
    console.log('App running on port 8080...')
})
