"use strict"

require("dotenv").config()

const passport = require("passport")
const express = require("express")
const router = express.Router()

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next()
  res.redirect("/")
}

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index")
})

/* User Homepage. */
router.get("/dashboard", isLoggedIn, function(req, res) {
  res.render("dashboard", {
    user: req.user // get the user out of session and pass to template
  })
})

/* Authentication. */
router.post(
  "/join",
  passport.authenticate("local-signup", {
    successRedirect: "/dashboard",
    failureRedirect: "/join",
    failureFlash: true
  })
)

router.get("/join", (req, res) => {
  res.render("join", { message: req.flash("signupMessage") })
})

router.get("/login", (req, res) => {
  res.render("login", { message: req.flash("loginMessage") })
})

router.post(
  "/login",
  passport.authenticate("local-login", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
    failureFlash: true
  })
)

router.get("/logout", (req, res) => {
  req.logout()
  res.redirect("/")
})

module.exports = router
