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

userRouter.route('/:id').get((req, res) => {
    userModel.findOne({_id: req.params.id}, (error, foundUser) => {
        if (error) {return error}
        else if (!foundUser) {res.status(404).json({"message":"User not found"})}
        else {res.status(200).json({foundUser})}
    })
}).delete((req, res) => {
    userModel.findOneAndDelete({_id: req.params.id}, (error, foundUser) => {
        if (error) {return error}
        else if (!foundUser) {res.status(404).json({"message": "User not found"})}
        else {res.status(200).json({foundUser})}
    })
}).patch((req, res) => {
        userModel.findOneAndUpdate({_id: req.params.id}, {useFindAndModify: false}, (error, foundUser) => {
                foundUser.email = (req.body.email || foundUser.email)
                foundUser.name = (req.body.name || foundUser.name)
                foundUser.personalNumber = (req.body.personalNumber || foundUser.personalNumber)
                foundUser.phone = (req.body.phone || foundUser.phone)
                foundUser.password = (req.body.password || foundUser.password)
            foundUser.save()
        }).then((updatedUser) => {
            console.log(`updatedUser: ${updatedUser}`)
            res.json({updatedUser})
        }).catch(error => {console.log(error)})
})

userRouter.route('/emails/:email').get((req, res) => {
    let userEmail = req.params.email
    userModel.findOne({email: userEmail}, (error, foundUser) => {
        if (error) {return error}
        else if (!foundUser) {res.status(404).json({"message": "User not found"})}
        else {res.status(200).json({foundUser})}
    })
})


passport.use(new LocalStrategy({usernameField: "email", passwordField: "password"},  (email, password, done) => {
    userModel.findOne({email: email}).then(foundUser => {

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