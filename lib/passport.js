"use strict"

const db = require("./db")
const LocalStrategy = require("passport-local").Strategy
const User = db.User

module.exports = function(passport) {
  passport.use(
    "local-login",
    new LocalStrategy(
      {
        // by default, local strategy uses username and password, we will override with email
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true // allows us to pass back the entire request to the callback
      },
      function(req, email, password, done) {
        User.findOne({ "email": email }, function(err, user) {
          if (err) return done(err)
          if (!user)
            return done(
              null,
              false,
              req.flash("loginMessage", "No user found.")
            )
          if (!user.validPassword(password))
            return done(
              null,
              false,
              req.flash("loginMessage", "Oops! Wrong password.")
            )

          // all is well, return successful user
          return done(null, user)
        })
      }
    )
  )

  // used to serialize the user for the session
  passport.serializeUser(function(user, done) {
    done(null, user.id)
  })

  // used to deserialize the user
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user)
    })
  })

  passport.use(
    "local-signup",
    new LocalStrategy(
      {
        // by default, local strategy uses username and password, we will override with email
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true // allows us to pass back the entire request to the callback
      },
      function(req, email, password, done) {
        process.nextTick(function() {
          User.findOne({ email: email }, function(err, user) {
            if (err) return done(err)

            if (user) {
              return done(
                null,
                false,
                req.flash("signupMessage", "That email is already taken.")
              )
            } else {
              let newUser = new User()

              newUser.email = email
              newUser.neighborhood = req.body.neighborhood
              newUser.password = newUser.generateHash(password)
              newUser.save(function(err) {
                if (err) throw err
                return done(null, newUser)
              })
            }
          })
        })
      }
    )
  )
}