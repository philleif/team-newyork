"use strict"

require("dotenv").config()

const db = require("../lib/db")
const userHelper = require("../lib/user")
const passport = require("passport")
const express = require("express")
const router = express.Router()

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next()
  res.redirect("/login")
}

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index")
})

/* User Homepage. */
router.get("/dashboard", isLoggedIn, async (req, res) => {
  let letter = await db.Letter.findOne({}).sort("-date")

  let districts = await db.District.find({
    $text: { $search: req.user.neighborhood }
  })

  let rep = await db.Member.findOne({
    district: districts[0].number
  })

  res.render("dashboard", {
    user: req.user,
    rep: rep,
    letter: letter,
    district: districts[0]
  })
})

/* User settings */
router.get("/settings", isLoggedIn, (req, res) => {
  res.render("settings", {
    user: req.user
  })
})

router.post("/settings", isLoggedIn, async (req, res) => {
  await userHelper.updateSettings(req.user, req.body)

  res.redirect("/settings")
})

router.post("/password", isLoggedIn, async (req, res) => {
  await userHelper.updatePassword(req.user, req.body)

  res.redirect("/settings")
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
