"use strict"

const axios = require("axios")

// events/16204/eventitems?token=
// https://webapi.legistar.com/v1/nyc/events?$filter=EventDate+ge+datetime%272018-03-01%27&token=

const API_BASE = "https://webapi.legistar.com/v1/nyc/"
const DATE_FILTER = "$filter=EventDate+ge+datetime%272014-09-01"
const COUNCIL_API_TOKEN = process.env.COUNCIL_API_TOKEN

const fetchDistricts = async () => {
  return new Promise(async (resolve, reject) => {
    await axios
      .get("http://callnyc.org/api/districts/")
      .then(results => {
        resolve(results.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}


module.exports = {
  fetchDistricts
}
