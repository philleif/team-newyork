"use strict"

let db = require("./db")

const parseAndReply = async data => {
  try {
    let intent = data.queryResult.intent.displayName
    let incomingPhoneNumber = false
    let user = false
    let response = "Not sure I understood that..."

    if (typeof data.originalDetectIntentRequest.payload.data != "undefined") {
      incomingPhoneNumber =
        data.originalDetectIntentRequest.payload.data["From"]
    }

    if (intent === "representatives.contact") {
      response = "Mayor DeBlasio: @themayor"
    }

    return {
      fulfillmentText: response
    }
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  parseAndReply
}
