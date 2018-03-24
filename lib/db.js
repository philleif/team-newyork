"use strict"

require("dotenv").config()

const mongoose = require("mongoose")
const bcrypt = require("bcrypt-nodejs")

const DB_URL = process.env.DB_URL

/* City Council Members */
const MemberSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  twitter: String,
  portrait: String,
  banner: String,
  website: String,
  district: Number,
  committees: Object
})

MemberSchema.index({"committees": "text"})

const Member = mongoose.model("Member", MemberSchema)

/* Representatives */
const RepresentativeSchema = new mongoose.Schema({
  name: String,
  phones: Array,
  party: String,
  emails: Array,
  channels: Array,
  portrait: String,
  urls: Array,
  office: String
})

const Representative = mongoose.model("Representative", RepresentativeSchema)

/* Districts */
const DistrictSchema = new mongoose.Schema({
  name: String,
  id: String,
  number: Number,
  borough: String,
  neighborhoods: Object
})

DistrictSchema.index({"neighborhoods": "text"})

const District = mongoose.model("District", DistrictSchema)

/* Letters */
const LetterSchema = new mongoose.Schema({
  content: String,
  subject: String,
  committee: String,
  date: Date
})

const Letter = mongoose.model("Letter", LetterSchema)

/* Meetings */
const MeetingSchema = new mongoose.Schema({
  name: String,
  committee: String,
  agenda: String,
  address: String,
  notification: String,
  time: String,
  date: Date
})

const Meeting = mongoose.model("Meeting", MeetingSchema)

/* Users */
const UserSchema = new mongoose.Schema({
  name: String,
  neighborhood: String,
  email: String,
  password: String,
  letters: Array
})

UserSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
}

UserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password)
}

const User = mongoose.model("User", UserSchema)

async function run() {
  // No need to `await` on this, mongoose 4 handles connection buffering
  // internally
  mongoose.connect(DB_URL)
}

run().catch(error => console.error(error.stack))

module.exports = {
  Member,
  District,
  User,
  Letter,
  Meeting,
  Representative
}
