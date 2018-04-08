"use strict"

const db = require("../lib/db")
const notifications = require("../lib/notifications")
const agenda = require("../lib/agenda")

const run = async () => {
  agenda.on("ready", async () => {
    await db.AgendaJob.remove({})

    agenda.every("1 hour", "send letter notifications")
    agenda.every("1 hour", "send meeting notifications")

    agenda.start()
  })
}

run()
