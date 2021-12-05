const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const model = require("../models").users

const { log } = console;

passport.serializeUser((serializedUser, done) => {
  done(null, serializedUser._id);
});

passport.deserializeUser((id, done) => {
  userModel.findOne({ _id: id }, (error, deserializedUser) => {
    done(error, deserializedUser);
  });
});

passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    (email, password, done) => {
      model.findOne({ email: email }).then((foundUser) => {
        if (!foundUser) {
          console.log("No user found");
          return done(null, false, { message: "User not found" });
        } else if (password === foundUser.password) {
          console.log("User has the same password");
          return done(null, foundUser);
        } else {
          console.log("Incorrect password");
          return done(null, false, { message: "incorrect password" });
        }
      });
    }
  )
);

const login = (username, password) => {
  console.log(username, password)
  // logic for login
  passport.authenticate("local", () => {
  });
}

const findAll = async () => {
  const req = await model.find().then((res) => res).catch((err) => log(err));
  return req
};

module.exports = {
  findAll: findAll,
  login: login,
};
