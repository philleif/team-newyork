"use strict"

const db = require("../lib/db")
const notifications = require("../lib/notifications")

const run = async () => {
  let user = await db.User.findOne({ email: "phil.leif@gmail.com" })
  let letter = await db.Letter.findOne({})

  await notifications.letter(user, letter)

  user.letters.push(letter.id)

  await user.save()
}

run()
