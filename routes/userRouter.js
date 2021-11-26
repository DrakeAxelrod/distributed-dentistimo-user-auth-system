var express = require('express')
var userRouter = express.Router()
let bodyParser = require('body-parser')
let userModel = require('../models/userSchema')
const mongoose = require('mongoose')

userRouter.use(bodyParser.json())
userRouter.use(bodyParser.urlencoded({extended: false}))

userRouter.route('/').get((req, res, next) => {
    userModel.find((error, user) => {
        if (error) {return error}
        else {
            res.status(200).json({"users":user})}
    })
}).post((req, res, next) => {
    let newUser = new userModel({
        patientid: req.body.patientid,
        email: req.body.email,
        name: req.body.name,
        personalNumber: req.body.personalNumber,
        phone: req.body.phone,
        password: req.body.password
    })

    // let newBooking = new bookerModel(req.body)
    console.log(`NEW USER: ${newUser}`)

    newUser.save(function(error, user) {
        if (error) {console.log(error)}
        res.json({user})
    })
})

module.exports = userRouter;