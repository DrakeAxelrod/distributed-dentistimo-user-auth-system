const model = require("../models").users;
const client = require("../utils/Client");
const bcrypt = require("bcrypt");
const SALT = 5;

const responsePath = "api/gateway/users";

const hashPass = async (password) => await bcrypt.hash(password, SALT);
const checkPass = async (reqPass, pass) => await bcrypt.compare(reqPass, pass);

const login = async (m) => {
  const result = await model
    .findOne({ email: m.email })
    .then(async (foundUser) => {
      if (!foundUser) {
        return { authenticated: false, message: "User not found" };
      }
      const isCorrectPass = await checkPass(m.password, foundUser.password);
      if (isCorrectPass) {
        return { authenticated: true, message: foundUser };
      } else {
        return { authenticated: false, message: "incorrect password" };
      }
    }).catch(err => (({ authenticated: false, message: "Something went wrong with your request please try again" })));
  if (result.authenticated) {
  const data = {
    authenticated: result.authenticated,
    message: {
      _id: result.message._id,
      email: result.message.email,
      name: {
        first: result.message.name.first,
        last: result.message.name.last,
      },
      personalNumber: result.message.personalNumber,
      phone: result.message.phone,
    },
  };
  return JSON.stringify(data);
  } else {
    return JSON.stringify(result)
  }
};

const register = async (user) => {
  user.password = await hashPass(user.password);
  const res = await model.create(user).then(res => res).catch(err => new Error());
  let new_user
  if (res !== typeof Error) {
    new_user = {
    _id: res._id,
    email: res.email,
    name: { first: res.name.first, last: res.name.last },
    personalNumber: res.personalNumber,
    phone: res.phone,
    bookings: res.bookings,
    };
  } else {
    new_user = { created: false }
  }
  return JSON.stringify(new_user);
};


module.exports = {
  login: login,
  register: register,
};
