const model = require("../models").users;
const client = require("../utils/Client");
const bcrypt = require("bcrypt");
const SALT = 5;
const { log } = console;


const responsePath = "api/gateway/users"


const hashPass = async (password) => await bcrypt.hash(password, SALT)
const checkPass = async (reqPass, pass) => await bcrypt.compare(reqPass, pass)

const login = async ({ email, password}) => { 
  const result = await model.findOne({email: email}).then( async foundUser => {
    if (!foundUser) 
    {
      return { authenticated: false, message: "User not found"} 
    }
    const isCorrectPass = await checkPass(password, foundUser.password)
    if (isCorrectPass) 
    {
      return { authenticated: true, message: foundUser }
    }
    else 
    {
        return { authenticated: false, message: "incorrect password" }
    }
  })
  return result
}
const register = async (topic, user) => {
  user.password = await hashPass(user.password)
  const res = await model.create(user)
  const new_user = {
    _id: res._id, 
    email: res.email,
    name: { first: res.name.first, last: res.name.last },
    personalNumber: res.personalNumber,
    phone: res.phone,
    bookings: res.bookings,
  }
  console.log(new_user)
  client.publish(`${responsePath}/${topic}`, JSON.stringify(new_user))
}

const findAll = async () => {
  const res = await model.find().then((res) => res).catch((err) => log(err));
  return res
};

module.exports = {
  findAll: findAll,
  login: login,
  register: register
};
