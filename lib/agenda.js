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
    const delay = new Date().setDate(today.getDate() - 0.125) // 3 hr window

    console.log("running send letters..." + today)

    let users = await db.User.find({})

    for (let user of users) {
      // respect last notified date
      if (user.lastMessage < delay) {
        let letters = await db.Letter.find({
          // find active letters
          published: true,
          expiration: { $gt: today.getDate() }
        })

        for (let letter of letters) {
          // send the first letter that the user hasn't seen
          if (user.lastMessage < delay) {
            await notifications.letter(user, letter)
          }
        }
      }
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
    const delay = new Date().setDate(today.getDate() - 0.125) // 3 hr window

    console.log("running send meetings..." + today)

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
