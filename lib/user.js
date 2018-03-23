"use strict"

const db = require("./db")

const updateSettings = async (user, settings) => {
  try {
    let dbUser = await db.User.findOne({ email: user.email })

    user.name = settings.name
    user.email = settings.email

    await user.save()
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  updateSettings
}