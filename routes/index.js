"use strict"

const express = require("express")
const router = express.Router()

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index")
})

/* JOIN flow. */
router.get("/join", function(req, res, next) {
  res.render("join")
})

module.exports = router
