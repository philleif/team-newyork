"use strict"

const db = require("./db")
const phone = require("phone")

const savePhone = async (user, number) => {
  try {
    user.phone.number = phone(number, '')[0]

    await user.save()
  } catch (error) {
    console.log(error)
  }
}

const verifyPhone = async (number, code) => {
  try {
    let user = await db.User.findOne({ "phone.number": number })

    if (typeof user != "undefined") {
      if (user.phone.verifyCode === code) {
        user.phone.verified = true
        await user.save
        return true
      }
    }

    return false
  } catch (error) {
    console.log(error)
  }
}

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
  updatePassword,
  savePhone,
  verifyPhone
}
