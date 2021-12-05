const mongoose = require("mongoose");
const { Schema } = mongoose

const users = new Schema({
  patientid: { type: Number },
  email: { type: String },
  name: { type: String },
  personalNumber: { type: String },
  phone: { type: Number },
  password: { type: String },
  bookings: { type: Object, ref: "booker" }, // should probably just be a booking id ref for the other mongodb database
});

module.exports = mongoose.model("user", users);
