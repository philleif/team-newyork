"use strict"

require("dotenv").config()

const Intercom = require("intercom-client")
const client = new Intercom.Client({ token: process.env.INTERCOM_TOKEN })

const updateLetterCount = async user => {
  try {
    await client.users.update({
      email: user.email,
      custom_attributes: {
        letterCount: user.letters.length
      }
    })
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  updateLetterCount
}