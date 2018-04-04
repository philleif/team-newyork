"use strict"

const db = require("./db")
const twilio = require("./twilio")

const letter = async (user, letter) => {
  try {
    let url = null

    if (user.letters.includes(letter.id)) {
      letter = false
      console.log("letter already sent to", user.name)
    } else {
      // append custom url to letter notification
      url = "https://newyorkcity.team/" + letter.id + "/" + user.tokens.letter
    }

    if (user.phone.verified && letter) {
      await twilio.notify(user, letter.notificationText + "\n\n" + url)
    }

    if (!user.phone.verified && letter) {
      // TODO: email letter
      console.log('emailing letter')
    }

  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  letter
}
