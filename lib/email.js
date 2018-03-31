"use strict"

require("dotenv").config()

const db = require("./db")
const mandrill = require("mandrill-api/mandrill")

const mandrill_client = new mandrill.Mandrill(process.env.MANDRILL_API_KEY)
const footer =
  "<br /><br />--<br /><br />Sent via \
  <a href='https://newyorkcity.team'>Team New York</a>"

const sendSubmission = async (user, submission) => {
  let message = {
    html: submission,
    text: submission,
    subject: "[Team New York] Submission from " + user.name,
    from_email: process.env.EMAIL,
    from_name: user.name,
    to: [
      {
        email: process.env.EMAIL,
        name: "Team New York",
        type: "to"
      },
      {
        email: user.email,
        name: user.name,
        type: "cc"
      }
    ],
    headers: {
      "Reply-To": process.env.EMAIL
    }
  }

  let async = false
  let ip_pool = "Main Pool"

  mandrill_client.messages.send(
    { message: message, async: async, ip_pool: ip_pool },
    function(result) {
      console.log(result)
    },
    function(e) {
      console.log("A mandrill error occurred: " + e.name + " - " + e.message)
    }
  )
}

const sendLetter = async (user, member, letter) => {
  let message = {
    html:
      "Rep. " +
      member.name +
      "<br /><br />" +
      letter.content +
      "<br /><br />Your constituent, " +
      user.name +
      footer,
    text: letter.content + "Sincerely, " + user.name,
    subject: "[Team New York] " + letter.subject,
    from_email: process.env.EMAIL,
    from_name: user.name,
    to: [
      {
        email: process.env.EMAIL,
        name: member.name,
        type: "to"
      },
      {
        email: user.email,
        name: user.name,
        type: "cc"
      }
    ],
    headers: {
      "Reply-To": process.env.EMAIL
    }
  }

  let async = false
  let ip_pool = "Main Pool"

  mandrill_client.messages.send(
    { message: message, async: async, ip_pool: ip_pool },
    function(result) {
      console.log(result)
    },
    function(e) {
      console.log("A mandrill error occurred: " + e.name + " - " + e.message)
    }
  )
}

module.exports = {
  sendLetter,
  sendSubmission
}
