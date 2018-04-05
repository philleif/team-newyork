"use strict"

require("dotenv").config()

const db = require("./db")
const twilio = require("./twilio")
const BitlyClient = require("bitly")

const bitly = BitlyClient(process.env.BITLY_API_KEY)

const letter = async (user, letter) => {
  try {
    let url = null

    if (!user.notifications.letters.includes(letter.id)) {
      // append custom url to letter notification
      url = await bitly.shorten(
        "https://newyorkcity.team/" + letter.id + "/" + user.tokens.letter
      )

      if (user.phone.verified && letter) {
        // SMS
        await twilio.notify(user, letter.notificationText + "\n\n" + url.data.url)
        console.log("texting letter")
      }

      if (!user.phone.verified && letter) {
        // EMAIL
        // TODO: email letter
        console.log("emailing letter")
      }

      user.notifications.letters.push(letter.id)
      user.lastMessage = new Date()

      await user.save()
    }
  } catch (error) {
    console.log(error)
  }
}

const meeting = async (user, meeting) => {
  try {
    let url = await bitly.shorten("http://dev.newyorkcity.team/event/" + meeting.id)

    if (!user.notifications.meetings.includes(meeting.id)) {
      if (user.phone.verified && meeting) {
        // SMS
        console.log(meeting.notificationText)
        await twilio.notify(
          user,
          meeting.notificationText + "\n\n" + url.data.url
        )
      }

      if (!user.phone.verified && meeting) {
        // EMAIL
        // TODO: email meeting
        console.log("emailing event")
      }

      user.notifications.meetings.push(meeting.id)
      user.lastMessage = new Date()

      await user.save()
    }
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  letter,
  meeting
}
