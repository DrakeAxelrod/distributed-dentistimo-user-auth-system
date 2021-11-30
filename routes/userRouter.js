var express = require('express')
var userRouter = express.Router()
let bodyParser = require('body-parser')
let userModel = require('../models/userSchema')
const mongoose = require('mongoose')
let passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

userRouter.use(bodyParser.json())
userRouter.use(bodyParser.urlencoded({extended: false}))
userRouter.use(passport.initialize())

passport.serializeUser((serializedUser, done) => {
  done(null, serializedUser._id)
})

passport.deserializeUser((id, done) => {
    userModel.findOne({_id: id}, (error, deserializedUser) => {
        done(error, deserializedUser)
    })
})

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


passport.use(new LocalStrategy({usernameField: "email", passwordField: "password"},  (email, password, done) => {
    userModel.findOne({email: email}).then(foundUser => {
        console.log('FOUNDUSER:')
        console.log(foundUser)

        console.log(`EMAIL: ${email}`)
        console.log(`PASS: ${password}`)

      if (!foundUser) {console.log('No user found')
      return done(null, false, {"message":"User not found"})
      }
      else if (password === foundUser.password) {
          console.log('User has the same password')
      return done(null, foundUser)
      }
      else {
          console.log('Incorrect password')
          return done(null, false, {"message":"incorrect password"})
      }
    })
}))

userRouter.post('/login', (req, res, next) => {
    passport.authenticate('local', function (error, user, data) {

        req.login(user, (error, next) => {
            if (error) {
                console.log('req.login error')
            }
            else {
                res.json(user)
            }
        })
    }) (req, res, next);
})













module.exports = userRouter;