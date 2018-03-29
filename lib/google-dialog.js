"use strict"

let db = require("./db")

/*
{ responseId: 'f1047875-3bb4-4997-a3d5-9f424a99096c',
  queryResult:
   { queryText: 'email the mayor',
     parameters: { channel: 'email', representative: '', mayor: 'mayor' },
     allRequiredParamsPresent: true,
     fulfillmentMessages: [ [Object] ],
     intent:
      { name: 'projects/citizen-capital-179821/agent/intents/6108e358-db49-4e0d-995a-89f63e52b2bc',
        displayName: 'representatives.contact' },
     intentDetectionConfidence: 1,
     diagnosticInfo: {},
     languageCode: 'en' },
  originalDetectIntentRequest: { payload: {} },
  session: 'projects/citizen-capital-179821/agent/sessions/edaf7ba7-3a01-4ff4-acba-6a451880c0ab' }
*/

const parseAndReply = async data => {
  try {
    let intent = data.queryResult.intent.displayName
    let incomingPhoneNumber = data.originalDetectIntentRequest.payload.data["From"]
    let response = "Not sure I understood that..."

    if (intent === "representatives.contact") {
      response = "Mayor DeBlasio: @themayor"
    }

    return ({
      fulfillmentText: response
    })
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  parseAndReply
}