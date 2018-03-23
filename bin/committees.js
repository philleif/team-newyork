"use strict"

const db = require("../lib/db")
const fs = require("fs")
const axios = require("axios")
const cheerio = require("cheerio")

const CsvReader = require("csv-reader")

const run = async () => {
  try {
    let urls = await getUrls()
    let query = "?view=committees"

    console.log(urls)

    // fetch each url and parse out committees
    let district = 1

    for(let url of urls) {
      let html = await fetchHtml(url + query)
      let $ = await cheerio.load(html)
      let links = $(".table-responsive").find("a").toArray()

      let rep = await db.Member.findOne({
        district: district
      })

      rep.committees = []

      for(let link of links) {
        console.log("District", district, rep.name, link.children[0].data)
        rep.committees.push(link.children[0].data)
      }

      await rep.save()

      district++
    }

  } catch (error) {
    throw error
  }
}

const fetchHtml = async url => {
  return new Promise((resolve, reject) => {
    axios.get(url).then((response) => {
      resolve(response.data)
    })
  })
}

const getUrls = async () => {
  return new Promise((resolve, reject) => {
    let inputStream = fs.createReadStream("./tmp/member-urls.csv", "utf8")
    let urls = []

    inputStream
      .pipe(CsvReader({ parseNumbers: true, parseBooleans: true, trim: true }))
      .on("data", async row => {
        urls.push(row[0])
      })
      .on("end", function(data) {
        resolve(urls)
      })
  })
}

run()