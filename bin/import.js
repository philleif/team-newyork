"use strict"

const city = require("../lib/city-council")
const db = require("../lib/db")

const run = async () => {
  await db.District.remove({}, function() {})
  await db.Member.remove({}, function() {})

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

    let member = new db.Member({
      name: district["member-name"],
      phone: district["phone"],
      email: district["email"],
      twitter: district["twitter"],
      portrait: district["member-portrait"],
      banner: district["member-banner"],
      website: district["website"],
      district: district["district-number"]
    })

    await member.save()

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
}

run()
