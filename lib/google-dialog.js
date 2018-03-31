"use strict"

const db = require("./db")
const userHelper = require("./user")

const parseAndReply = async data => {
  console.log(data)

  try {
    let intent = data.queryResult.intent.displayName
    let incomingPhoneNumber = false
    let user = false
    let response = "Not sure I understood that..."

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

    return {
      fulfillmentText: response
    }
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
      response = `You can reach the mayor via twitter at @${representative.channels[0].id}`
    } else {
      let member = await userHelper.lookupMember(user)
      response = `You're represented by ${member.name} (District ${member.district}):\n${member.email}\n${member.phone}`
    }

    return response
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  parseAndReply
}
