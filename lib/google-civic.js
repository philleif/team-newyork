"use strict"

require("dotenv").config()

const axios = require("axios")

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY
const API_ENDPOINT = "https://www.googleapis.com/civicinfo/v2/representatives"

const fetchRepsByAddress = async address => {
  return new Promise((resolve, reject) => {
    axios
      .get(API_ENDPOINT + "?address=" + address  + "&key=" + GOOGLE_API_KEY)
      .then(response => {
        resolve(response.data)
      })
  })
}

module.exports = {
  fetchRepsByAddress
}
