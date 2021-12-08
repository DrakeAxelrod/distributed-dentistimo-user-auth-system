const mongoose = require("mongoose");
//const passportLocalMongoose = require("passport-local-mongoose");
const { Schema } = mongoose

const users = new Schema({
  patientid: { type: Number },
  email: { required: true, type: String },
  name: {
    first: { required: true, type: String },
    last: { required: true, type: String },
  },
  personalNumber: { required: true, type: String },
  phone: { required: true, type: Number },
  password: { required: true, type: String },
  bookings: [{ type: String }], // check this one
});

// users.plugin(passportLocalMongoose, {
//   usernameField: "email"
// })


module.exports = mongoose.model("user", users);
