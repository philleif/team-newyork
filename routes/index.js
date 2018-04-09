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
const sm = require("sitemap")

const router = express.Router()

let sitemap = sm.createSitemap({
  hostname: "https://newyorkcity.team",
  cacheTime: 600000, // 600 sec - cache purge period
  urls: [{ url: "/", changefreq: "daily", priority: 0.3 }]
})

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next()
  res.redirect("/login")
}

/* Sitemap */
router.get("/sitemap.xml", function(req, res) {
  sitemap.toXML(function(err, xml) {
    if (err) {
      return res.status(500).end()
    }
    res.header("Content-Type", "application/xml")
    res.send(xml)
  })
})

/* GET home page. */
router.get("/", async (req, res, next) => {
  const today = new Date()

  let meetings = await db.Meeting.find({
    published: true,
    date: { $gt: today }
  })
    .limit(1)
    .sort({ date: 1 })
  let representative = await db.Representative.findOne({
    office: "Mayor"
  })
  let letter = await db.Letter.findOne({
    published: true,
    expiration: { $gt: today },
    office: "Mayor"
  })

  res.render("index", {
    user: req.user,
    meetings: meetings,
    letter: letter,
    representative: representative
  })
})

/* Send a letter via dashboard. */
router.post("/email", isLoggedIn, async (req, res) => {
  let letter = await db.Letter.findOne({ _id: req.body.letter })
  let rep = await db.Representative.findOne({ _id: req.body.representative })
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

router.get("/thanks", async (req, res) => {
  res.render("thanks")
})

router.get("/submit/:token", async (req, res) => {
  let user = await db.User.findOne({ "tokens.letter": req.params.token })

  res.render("submit", { user: user })
})

router.post("/submit/simple", async (req, res) => {
  let user = await db.User.findOne({ "tokens.letter": req.body.token })

  await email.sendSubmission(user, req.body.submission)

  userHelper.refreshTokens(user)

  res.redirect("/thanks")
})

/* User Homepage. */
router.get("/dashboard", isLoggedIn, async (req, res) => {
  const today = new Date()
  let representative = null

  let letter = await db.Letter.findOne({
    published: true,
    expiration: { $gt: today }
  })

  if (letter.office === "City Council") {
    representative = req.user.representatives.councilMember
  } else {
    representative = await db.Representative.findOne({
      office: letter.office
    })
  }

  let meetings = await db.Meeting.find({
    published: true,
    date: { $gt: today }
  })
    .sort({ date: 1 })
    .limit(5)

  if (req.user.letters.includes(letter.id)) {
    letter = false
  }

  res.render("dashboard", {
    representative: representative,
    user: req.user,
    meetings: meetings,
    letter: letter
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
  res.render("pages/terms")
})

router.get("/privacy", (req, res) => {
  res.render("pages/privacy")
})

/* Chat bot handler */
router.post("/dialog", async (req, res) => {
  let response = await dialog.parseAndReply(req.body)

  res.json(response)
})

/* Event landing page */
router.get("/event/:id", async (req, res) => {
  let meeting = await db.Meeting.findOne({ _id: req.params.id })

  res.render("event", { meeting: meeting })
})

/* Letter landing page */
router.get("/letter/:id/", async (req, res) => {
  let letter = await db.Letter.findOne({ _id: req.params.id })
  let representative = await db.Representative.findOne({ office: letter.office })

  await intercom.createLead(req.body.name, req.body.email)

  res.render("letter", {
    representative: representative,
    letter: letter,
  })
})

router.post("/letter", async (req, res) => {
  let letter = await db.Letter.findOne({ _id: req.body.letter })
  let rep = await db.Representative.findOne({ _id: req.body.representative })

  let user = {
    name: req.body.name,
    email: req.body.email
  }

  await email.sendLetter(user, rep, letter)

  res.redirect("/share/" + letter.id)
})

router.get("/share/:id", async (req, res) => {
  let letter = await db.Letter.findOne({ _id: req.params.id })
  let representative = await db.Representative.findOne({ office: letter.office })

  res.render("share", {
    letter: letter,
    representative: representative
  })
})

module.exports = router
