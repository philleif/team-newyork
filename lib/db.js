"use strict"

require("dotenv").config()

const mongoose = require("mongoose")

const DB_URL = process.env.DB_URL

const MemberSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  twitter: String,
  portrait: String,
  banner: String,
  website: String,
  district: Number
})

const Member = mongoose.model("Member", MemberSchema)

const DistrictSchema = new mongoose.Schema({
  name: String,
  id: String,
  number: Number,
  borough: String,
  neighborhoods: Object
})

const District = mongoose.model("District", DistrictSchema)

const User = new mongoose.Schema({
  name: String,
  email: String,
  password: String
})

const User = mongoose.model("User", MemberSchema)


async function run() {
  // No need to `await` on this, mongoose 4 handles connection buffering
  // internally
  mongoose.connect(DB_URL)
}

run().catch(error => console.error(error.stack))

module.exports = {
  Member,
  District
}
