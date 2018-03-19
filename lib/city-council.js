"use strict"

const axios = require("axios")

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
