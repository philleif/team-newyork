"use strict"

require("dotenv").config()

const db = require("./db")
const notifications = require("./notifications")
const Agenda = require("agenda")

const mongoConnectionString = process.env.DB_URL

const agenda = new Agenda({ db: { address: mongoConnectionString } })

agenda.define("send letter notifications", async (job, done) => {
  try {
    console.log("running send letters...")

    let user = await db.User.findOne({})
    let letter = await db.Letter.findOne({})
    let today = new Date()
    let yesterday = new Date().setDate(today.getDate() - 1)

    // respect last notified date
    if (user.lastMessage < yesterday) {
      await notifications.letter(user, letter)
    }

    done()
  } catch (error) {
    console.log(error)
    done()
  }
})

agenda.define("send event notifications", async (job, done) => {
  console.log("running send events...")
  // respect last notified date
  done()
})

agenda.define("send general notifications", async (job, done) => {
  console.log("running send general notifications...")
  done()
})

module.exports = agenda
