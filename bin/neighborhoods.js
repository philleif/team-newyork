"use strict"

const db = require("../lib/db")

const run = async () => {
  let districts = await db.District.find({})

  for(let district of districts) {
    for(let neighborhood of district.neighborhoods) {
      console.log(neighborhood)
    }
  }
}

run()