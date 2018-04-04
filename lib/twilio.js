"use strict"

const twilio = require("twilio")

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const client = new twilio(accountSid, authToken)

const notify = async (user, content) => {
  try {
    await client.messages.create({
      body: content,
      to: user.phone.number, // Text this number
      from: process.env.TWILIO_NUMBER // From a valid Twilio number
    })
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  notify
}