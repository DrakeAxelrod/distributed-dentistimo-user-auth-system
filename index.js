let express = require('express')
let mongoose = require('mongoose')
let cors = require('cors')
let path = require('path')
let bodyParser = require('body-parser')
require('dotenv').config()

let databaseVariable = process.env.DATABASE_URL
let port = process.env.port || 3000

mongoose.connect(databaseVariable, (error) => {
    if (error) {console.log('Could not connect to database!'); process.exit(0)}
    else {console.log('Successfully connected to database!')}
})
let authenticationApp = express()
authenticationApp.use(express.json())
authenticationApp.options('*', cors())
authenticationApp.use(cors())
authenticationApp.use(bodyParser.urlencoded({extended: false}))
authenticationApp.use(bodyParser.json())

authenticationApp.use("/api/users", require('./routes/userRouter'))
authenticationApp.use("/api", function() {
    console.log('/api not implemented yet')
});

authenticationApp.listen(port, (error) => {
    if (error) {throw error}
    else {console.log(`Listening to port: ${port}`)}
})

module.exports = authenticationApp;