const mongoose = require('mongoose')

let userSchema = new mongoose.Schema({
    patientid: {type: Number},
    email: {type: String},
    name: {type: String},
    personalNumber: {type: String},
    phone: {type: Number},
    password: {type: String},
    bookings: {type: Object, ref:"booker"}
})

module.exports = mongoose.model('user', userSchema)