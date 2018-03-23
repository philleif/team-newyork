"use strict"

require("dotenv").config()

const mongoose = require("mongoose")
const bcrypt = require("bcrypt-nodejs")

const DB_URL = process.env.DB_URL

/* Representatives */
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

/* Users */
const UserSchema = new mongoose.Schema({
  name: String,
  neighborhood: String,
  email: String,
  password: String
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
  Letter
}
