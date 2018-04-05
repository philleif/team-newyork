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

  agenda.on("ready", async () => {
    await db.AgendaJob.remove({})

    agenda.every("10 seconds", "send letter notifications")
    agenda.every("10 seconds", "send meeting notifications")


    agenda.start()
  })
}

run()
