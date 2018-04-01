"use strict"

require("dotenv").config()

const db = require("./db")
const phone = require("phone")
const twilio = require("twilio")
const md5 = require("md5")

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN

const client = new twilio(accountSid, authToken)

const refreshTokens = async user => {
  try {
    user.tokens.letter = md5(Math.floor(Math.random() * 900000 + 100000))
    user.tokens.passwordReset = md5(Math.floor(Math.random() * 900000 + 100000))

    await user.save()
  } catch (error) {
    console.log(error)
  }
}

const verificationReminder = async user => {
  try {
    await client.messages.create({
      body: "Please verify your phone number.",
      to: user.phone.number, // Text this number
      from: process.env.TWILIO_NUMBER // From a valid Twilio number
    })
  } catch (error) {
    console.log(error)
  }
}

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

      await client.messages.create({
        body: "Welcome to Team New York! 🗽",
        to: user.phone.number, // Text this number
        from: process.env.TWILIO_NUMBER // From a valid Twilio number
      })

      await client.messages.create({
        body:
          "I'll be sending you action alerts around issues and community events.\
        Plus, I'll help you write letters to your representative.",
        to: user.phone.number, // Text this number
        from: process.env.TWILIO_NUMBER // From a valid Twilio number
      })

      await client.messages.create({
        body:
          "You can also submit issues or community news by saying 'submit'.\
        Selected submissions will be sent as notificaitons to the whole team. 👫👭👬",
        to: user.phone.number, // Text this number
        from: process.env.TWILIO_NUMBER // From a valid Twilio number
      })

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
    user.representatives.councilMember = await lookupMember(user)
    user.representatives.representatives = await db.Representative.find({})

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

const lookupMember = async user => {
  try {
    let districts = await db.District.find({
      $text: { $search: user.neighborhood }
    })
    let member = await db.Member.findOne({
      district: districts[0].number
    })

    return member
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  updateSettings,
  updatePassword,
  savePhone,
  sendPhoneVerification,
  verifyPhone,
  refreshTokens,
  lookupMember
}
