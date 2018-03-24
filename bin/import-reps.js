"use strict"

const db = require("../lib/db")
const googleCivic = require("../lib/google-civic")

const run = async () => {
  try {
    await db.Representative.remove({}, function() {})

    let reps = await googleCivic.fetchRepsByAddress("new+york+city")
    let indices = reps.officials

    for(let office of reps.offices) {
      for(let index of office.officialIndices) {
        let rep = new db.Representative()

        rep.office = office.name
        rep.name = indices[index].name
        rep.party = indices[index].party
        rep.portrait = indices[index].photoUrl
        rep.addresses = indices[index].addresses
        rep.channels = indices[index].channels
        rep.phones = indices[index].phones
        rep.emails = indices[index].emails
        rep.urls = indices[index].urls

        await rep.save()
      }
    }
  } catch (error) {
    throw error
  }
}

run()
