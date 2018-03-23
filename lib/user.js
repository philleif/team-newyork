"use strict"

const db = require("./db")

const updateSettings = async (user, settings) => {
  try {
    user.name = settings.name
    user.email = settings.email
    user.neighborhood = settings.neighborhood

    await user.save()
  } catch (error) {
    console.log(error)
  }
}

const updatePassword = async (user, passwords) => {
  try {
    if (user.validPassword(passwords.current_password)) {
      user.password = user.generateHash(passwords.new_password)

      await user.save()
    }
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  updateSettings,
  updatePassword
}