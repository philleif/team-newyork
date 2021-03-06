"use strict"

require("dotenv").config()

const db = require("./db")
const stripe = require("./stripe")
const LocalStrategy = require("passport-local").Strategy
const userHelper = require("./user")

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
        User.findOne({ email: email }, function(err, user) {
          if (err) return done(err)
          if (!user)
            return done(
              null,
              false,
              req.flash("loginMessage", "No user found for that email.")
            )
          if (!user.validPassword(password))
            return done(
              null,
              false,
              req.flash("loginMessage", "Invalid user/password combination.")
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
    User.findOne({ _id: id })
      .populate("representatives.councilMember")
      .populate("representatives.representatives")
      .exec(function(err, user) {
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
          User.findOne({ email: email }, async (err, user) => {
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
              newUser.name = req.body.name
              newUser.phone.verified = false
              newUser.phone.verifyCode = Math.floor(
                Math.random() * 900000 + 100000
              ) // six-digit random number
              newUser.password = newUser.generateHash(password)
              newUser.stripeId = await stripe.saveStripeUser(newUser.email)
              newUser.representatives.councilMember = await userHelper.lookupMember(
                newUser
              )

              let representatives = await db.Representative.find({
                office: { $ne: "City Council" }
              })

              newUser.representatives.representatives = representatives

              newUser.save()

              await userHelper.refreshTokens(newUser)

              return done(null, newUser)
            }
          })
        })
      }
    )
  )
}
