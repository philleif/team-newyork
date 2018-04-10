"use strict"

const db = require("../lib/db")
const googleCivic = require("../lib/google-civic")
const city = require("../lib/city-council")

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
        rep.global = true

        await rep.save()
      }
    }

    let districts = await city.fetchDistricts()

    for (let district of districts.districts) {
      let representative = new db.Representative({
        name: district["member-name"],
        phones: [district["phone"]],
        district: district["district-number"],
        emails: [district["email"]],
        channels: [{ Type: "twitter", id: district["twitter"] }],
        portrait: district["member-banner"],
        urls: [district["website"]],
        office: "City Council"
      })

      await representative.save()

      let d = new db.District({
        name: district["district-name"],
        id: district["id"],
        number: district["district-number"],
        borough: district["district-borough"],
        neighborhoods: district["neighborhoods"].split(", ")
      })

      await d.save()
    }

    console.log("Done.")
  } catch (error) {
    throw error
  }
}

run()
