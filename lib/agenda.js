"use strict"

require("dotenv").config()

const db = require("./db")
const notifications = require("./notifications")
const Agenda = require("agenda")

const mongoConnectionString = process.env.DB_URL

const agenda = new Agenda({ db: { address: mongoConnectionString } })

agenda.define("send letter notifications", async (job, done) => {
  try {
    const today = new Date()
    const delay = new Date().setDate(today.getDate() - 0.25) // 6 hr window

    console.log("running send letters...")

    let user = await db.User.findOne({})
    let letter = await db.Letter.findOne({
      published: true,
      expiration: { $gt: today.getDate() }
    })

    // respect last notified date
    if (user.lastMessage < delay) {
      await notifications.letter(user, letter)
    }

    done()
  } catch (error) {
    console.log(error)
    done()
  }
})

agenda.define("send meeting notifications", async (job, done) => {
  try {
    const today = new Date()
    const delay = new Date().setDate(today.getDate() - 0.25) // 6 hr window

    console.log("running send meetings...")

    let user = await db.User.findOne({})
    let meeting = await db.Meeting.findOne({
      published: true,
      date: { $gt: today.getDate() }
    }).sort({
      date: 1
    })

    // respect last notified date
    if (user.lastMessage < delay) {
      await notifications.meeting(user, meeting)
    }

    done()
  } catch (error) {
    console.log(error)
    done()
  }
})

agenda.define("send general notifications", async (job, done) => {
  console.log("running send general notifications...")
  done()
})

module.exports = agenda
