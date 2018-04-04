"use strict"

const db = require("./db")
const twilio = require("./twilio")

const letter = async (user, letter) => {
  try {
    let url = null

    if (user.notifications.letters.includes(letter.id)) {
      letter = false
      console.log("letter already sent to", user.name)
    } else {
      // append custom url to letter notification
      url = "https://newyorkcity.team/" + letter.id + "/" + user.tokens.letter
    }

    if (user.phone.verified && letter) {
      // SMS
      await twilio.notify(user, letter.notificationText + "\n\n" + url)
    }

    if (!user.phone.verified && letter) {
      // EMAIL
      // TODO: email letter
      console.log("emailing letter")
    }
  } catch (error) {
    console.log(error)
  }
}

const eevent = async (user, eevent) => {
  try {
    let url = "http://dev.america.team/event/" + eevent.id

    if (user.notifications.events.includes(eevent.id)) {
      eevent = false
      console.log("event already sent to", user.name)
    }

    if (user.phone.verified && letter) {
      // SMS
      await twilio.notify(user, eevent.notificationText + "\n\n" + url)
    }

    if (!user.phone.verified && letter) {
      // EMAIL
      // TODO: email letter
      console.log("emailing event")
    }
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  letter,
  eevent
}
