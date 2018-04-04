"use strict"

const db = require("../lib/db")
const notifications = require("../lib/notifications")
const agenda = require("../lib/agenda")

const run = async () => {
  /*
  let user = await db.User.findOne({})
  let meeting = await db.Meeting.findOne({})

  // send an event notification
  await notifications.meeting(user, meeting)
  user.notifications.meetings.push(meetings.id)
  user.lastMessage = new Date()
  await user.save()
  */
  //await db.AgendaJob.remove({}, function() {})

  agenda.on("ready", function () {
    agenda.every("5 seconds", "send letter notifications")

    agenda.start()
  })
}

run()
