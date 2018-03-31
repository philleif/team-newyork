"use strict"

require("dotenv").config()

const db = require("../lib/db")
const stripe = require("../lib/stripe")
const userHelper = require("../lib/user")
const email = require("../lib/email")
const dialog = require("../lib/google-dialog")
const passport = require("passport")
const express = require("express")
const intercom = require("../lib/intercom")

const router = express.Router()

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next()
  res.redirect("/login")
}

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index")
})

/* Send a letter via dashboard. */
router.post("/email", isLoggedIn, async (req, res) => {
  let letter = await db.Letter.findOne({ _id: req.body.letter })
  let rep = await db.Member.findOne({ _id: req.body.member })
  let user = req.user

  user.letters.push(letter.id)
  await user.save()
  await intercom.updateLetterCount(user)

  await email.sendLetter(user, rep, letter)

  res.redirect("/share/" + letter.id)
})

/* Email submission */
router.post("/submit", isLoggedIn, async (req, res) => {
  await email.sendSubmission(req.user, req.body.submission)

  res.redirect("/thanks")
})

router.get("/thanks", isLoggedIn, async (req, res) => {
  res.render("thanks")
})

/* Email the mayor */
router.post("/mayor", async (req, res) => {
  await intercom.createLead(req.body.name, req.body.email)

  res.redirect("/mayor")
})

router.get("/mayor", async (req, res) => {
  res.render("mayor")
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

  res.redirect("/connect")
})

/* Phone confirmation */
router.get("/connect", isLoggedIn, (req, res) => {
  res.render("connect")
})

router.post("/connect", isLoggedIn, async (req, res) => {
  await userHelper.savePhone(req.user, req.body.phone)
  await userHelper.sendPhoneVerification(req.user)

  res.redirect("/verify")
})

router.get("/verify", isLoggedIn, (req, res) => {
  res.render("verify")
})

router.post("/verify", isLoggedIn, async (req, res) => {
  let verification = await userHelper.verifyPhone(req.user, req.body.code)

  if (!verification) {
    res.render("verify", { message: "Invalid code." })
  } else {
    res.redirect("/dashboard")
  }
})

/* Static Pages. */
router.get("/terms", (req, res) => {
  res.render("terms")
})

router.get("/privacy", (req, res) => {
  res.render("privacy")
})

/* Chat bot handler */
router.post("/dialog", async (req, res) => {
    let response = await dialog.parseAndReply(req.body)

    res.json(response)
})

/* Letter landing page */
router.get("/letter/:id/:token", async (req, res) => {
  let letter = await db.Letter.findOne({ _id: req.params.id })
  let user = await db.User.findOne({ "tokens.letter": req.params.token })
  let member = false
  let district = false

  if (user === null) {
    user = false
  } else {
    member = await userHelper.lookupMember(user)
    district = await db.District.findOne({
      $text: { $search: user.neighborhood }
    })

    if (user.letters.includes(letter.id)) {
      letter = false
    }
  }

  res.render("letter", {
    member: member,
    letter: letter,
    user: user,
    district: district
  })
})

router.post("/letter", async (req, res) => {
  let letter = await db.Letter.findOne({ _id: req.body.letter })
  let rep = await db.Member.findOne({ _id: req.body.member })
  let user = await db.User.findOne({ "tokens.letter": req.body.token })

  user.letters.push(letter.id)
  await user.save()

  await intercom.updateLetterCount(user)
  await email.sendLetter(user, rep, letter)
  await userHelper.refreshTokens(user)

  res.redirect("/share/" + letter.id)
})

router.get("/share/:id", async (req, res) => {
  let letter = await db.Letter.findOne({ _id: req.params.id })

  res.render("share", { letter: letter })
})

module.exports = router
