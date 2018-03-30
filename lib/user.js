"use strict"

require("dotenv").config()

const db = require("./db")
const phone = require("phone")
const twilio = require("twilio")

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN

const client = new twilio(accountSid, authToken)

const sendPhoneVerification = async user => {
  try {
    await client.messages.create({
      body: "Your Team New York verification code is " + user.phone.verifyCode,
      to: user.phone.number, // Text this number
      from: process.env.TWILIO_NUMBER // From a valid Twilio number
    })
  } catch (error) {
    console.log(error)
  }
}

const savePhone = async (user, number) => {
  try {
    user.phone.number = phone(number, "")[0]

    await user.save()
  } catch (error) {
    console.log(error)
  }
}

const verifyPhone = async (user, code) => {
  try {
    if (user.phone.verifyCode === code) {
      user.phone.verified = true
      await user.save()
      return true
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
  sendPhoneVerification,
  verifyPhone
}
