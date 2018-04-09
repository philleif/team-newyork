"use strict"

require("dotenv").config()

const mongoose = require("mongoose")
const bcrypt = require("bcrypt-nodejs")

const Schema = mongoose.Schema
const DB_URL = process.env.DB_URL

/* Representatives */
const RepresentativeSchema = new mongoose.Schema({
  name: String,
  phones: Array,
  party: String,
  district: String,
  committees: Object,
  emails: Array,
  channels: Array,
  portrait: String,
  urls: Array,
  office: String,
  global: { type: Boolean, default: false }
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

DistrictSchema.index({ neighborhoods: "text" })

const District = mongoose.model("District", DistrictSchema)

/* Agenda */
const JobSchema = new mongoose.Schema(
  {
    nextRunAt: Date
  },
  { collection: "agendaJobs" }
)

const AgendaJob = mongoose.model("AgendaJob", JobSchema)

/* Letters */
const LetterSchema = new mongoose.Schema({
  content: String,
  subject: String,
  image: String,
  shareText: String,
  notificationText: String,
  office: String,
  date: Date,
  expiration: Date,
  published: { type: Boolean, default: false }
})

const Letter = mongoose.model("Letter", LetterSchema)

/* Meetings */
const MeetingSchema = new mongoose.Schema({
  name: String,
  agenda: String,
  location: String,
  notificationText: String,
  time: String,
  date: Date,
  via: String,
  image: String,
  viaLink: String,
  published: { type: Boolean, default: false }
})

const Meeting = mongoose.model("Meeting", MeetingSchema)

/* Notifications */
const NotificationSchema = new mongoose.Schema({
  name: String,
  notificationText: String,
  sent: { type: Boolean, default: false },
  date: Date,
  published: { type: Boolean, default: false }
})

const Notification = mongoose.model("Notification", NotificationSchema)

/* Users */
const UserSchema = new mongoose.Schema({
  tokens: {
    letter: String,
    passwordReset: String
  },
  subscriber: { type: Boolean, default: false },
  name: String,
  neighborhood: String,
  district: String,
  email: String,
  password: String,
  lastMessage: Date,
  letters: Array, // sent letters
  notifications: {
    // notifications received
    letters: Array,
    meetings: Array,
    notifications: Array
  },
  stripeId: String,
  phone: {
    verified: Boolean,
    number: String,
    verifyCode: String
  },
  representatives: {
    councilMember: { type: Schema.Types.ObjectId, ref: "Representative" },
    representatives: [{ type: Schema.Types.ObjectId, ref: "Representative" }]
  }
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
  District,
  User,
  Letter,
  Meeting,
  Representative,
  AgendaJob
}
