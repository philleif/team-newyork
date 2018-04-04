"use strict"

const db = require("./db")
const twilio = require("./twilio")
const BitlyClient = require("bitly")

const bitly = BitlyClient(process.env.BITLY_API_KEY)

const letter = async (user, letter) => {
  try {
    let url = null

    if (user.notifications.letters.includes(letter.id)) {
      letter = false
      console.log("letter already sent to", user.name)
    } else {
      // append custom url to letter notification
      url = await bitly(
        "https://newyorkcity.team/" + letter.id + "/" + user.tokens.letter
      )
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

const meeting = async (user, meeting) => {
  try {
    let url = await bitly("http://dev.america.team/event/" + meeting.id)

    if (user.notifications.events.includes(meeting.id)) {
      meeting = false
      console.log("event already sent to", user.name)
    }

    if (user.phone.verified && letter) {
      // SMS
      await twilio.notify(user, meeting.notificationText + "\n\n" + url)
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
  meeting
}
