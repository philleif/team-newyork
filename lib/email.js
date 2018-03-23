"use strict"

require("dotenv").config()

const db = require("./db")
const mandrill = require("mandrill-api/mandrill")

const mandrill_client = new mandrill.Mandrill(process.env.MANDRILL_API_KEY)

const send = async (user, member, letter) => {
  let message = {
    html: "Rep. " + member.name + "<br /><br />" + letter.content + "<br /><br />Sincerely, " + user.name,
    text: letter.content + "Sincerely, " + user.name,
    subject: "[Team New York] " + letter.subject,
    from_email: process.env.EMAIL,
    from_name: user.name,
    to: [
      {
        email: process.env.EMAIL,
        name: member.name,
        type: "to"
      }
    ],
    headers: {
      "Reply-To": "message.reply@example.com"
    }
  }
  let async = false
  let ip_pool = "Main Pool"

  console.log(message)

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
  send
}
