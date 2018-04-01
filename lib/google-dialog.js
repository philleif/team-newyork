"use strict"

const db = require("./db")
const userHelper = require("./user")

const parseAndReply = async data => {
  console.log(data)

  try {
    let intent = data.queryResult.intent.displayName
    let incomingPhoneNumber = false
    let user = false
    let response =
      "Not sure I understood that... Type 'help' to see what I can do."

    // is this coming from twilio
    if (typeof data.originalDetectIntentRequest.payload.data != "undefined") {
      incomingPhoneNumber =
        data.originalDetectIntentRequest.payload.data["From"]
    }

    // find the user with this number
    if (incomingPhoneNumber) {
      user = await db.User.findOne({ "phone.number": incomingPhoneNumber })

      if (!user.phone.verified) {
        return {
          fulfillmentText:
            "Please verify your phone number to continue. https://newyorkcity.team/connect"
        }
      }
    }

    if (intent === "representatives.contact") {
      response = await handleRepresentativesContact(user, data)
    }

    if (intent === "app.help") {
      response = await handleAppHelp(user, data)
    }

    if (intent === "app.submit") {
      response = await handleAppSubmit(user, data)
    }

    return {
      fulfillmentText: response
    }
  } catch (error) {
    console.log(error)
  }
}

const handleAppSubmit = async (user, data) => {
  try {
    let response =
      "Ok! You can submit an issue here: https://newyorkcity.team/submit/" +
      user.tokens.letter

    return response
  } catch (error) {
    console.log(error)
  }
}

const handleAppHelp = async (user, data) => {
  try {
    let response =
      'Try one of these: "Contact my representative", "Submit an issue", "Change my password"'

    return response
  } catch (error) {
    console.log(error)
  }
}

const handleRepresentativesContact = async (user, data) => {
  try {
    let representative = null
    let response = null

    if (data.queryResult.parameters.mayor === "mayor") {
      representative = await db.Representative.findOne({ office: "Mayor" })

      response = `You can reach the mayor via twitter at @${
        representative.channels[0].id
      }`
    } else {
      let member = await userHelper.lookupMember(user)

      response = `You're represented by ${member.name} (District ${
        member.district
      }):\n${member.email}\n${member.phone}`
    }

    return response
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  parseAndReply
}
