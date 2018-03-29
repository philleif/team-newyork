"use strict"

require("dotenv").config()

const db = require("../lib/db")
const stripe = require("../lib/stripe")
const userHelper = require("../lib/user")
const email = require("../lib/email")
const dialog = require("../lib/google-dialog")
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

/* Send a letter. */
router.post("/email", isLoggedIn, async (req, res) => {
  let letter = await db.Letter.findOne({ _id: req.body.letter })
  let rep = await db.Member.findOne({ _id: req.body.member })
  let user = req.user

  user.letters.push(letter.id)
  await user.save()

  await email.sendLetter(user, rep, letter)

  res.redirect("/dashboard")
})

/* Email submission */
router.post("/submit", isLoggedIn, async (req, res) => {
  await email.sendSubmission(req.user, req.body.submission)

  res.redirect("/dashboard")
})

/* User Homepage. */
router.get("/dashboard", isLoggedIn, async (req, res) => {
  let letter = await db.Letter.findOne({}).sort("-date")
  let meetings = await db.Meeting.find({})
  let reps = await db.Representative.find({})
  let districts = await db.District.find({
    $text: { $search: req.user.neighborhood }
  })
  let member = await db.Member.findOne({
    district: districts[0].number
  })

  if (req.user.letters.includes(letter.id)) {
    letter = false
  }

  res.render("dashboard", {
    user: req.user,
    meetings: meetings,
    member: member,
    reps: reps,
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
    successRedirect: "/donate",
    failureRedirect: "/join",
    failureFlash: true
  })
)

router.get("/join", (req, res) => {
  let message = req.flash()
  res.render("join", { message: message.signupMessage })
})

router.get("/login", (req, res) => {
  let message = req.flash()
  res.render("login", { message: message.loginMessage })
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

/* Payment. */
router.get("/donate", isLoggedIn, (req, res) => {
  res.render("donate")
})

router.post("/donate", isLoggedIn, async (req, res) => {
  await stripe.createSubscription(req.user, req.body)

  res.redirect("/dashboard")
})

/* Static Pages. */
router.get("/terms", (req, res) => {
  res.render("terms")
})

router.get("/privacy", (req, res) => {
  res.render("privacy")
})

/* Chat bot */
router.post("/dialog", (req, res) => {
  console.log(req)
  res.json({ status: 200 })
})

module.exports = router
