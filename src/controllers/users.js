const model = require("../models").users
const bcrypt = require("bcrypt")
const SALT = 5
const { log } = console;


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
const register = async (user) => {
  user.password = await hashPass(user.password)
  model.create(user, (err) => {
    if (err) {
      log(err)
    }
  })
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
