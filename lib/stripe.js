"use strict"

const stripe = require("stripe")(process.env.STRIPE_API_SECRET)

const saveStripeUser = async email => {
  return new Promise((resolve, reject) => {
    stripe.customers
      .create({
        email: email
      })
      .then(customer => {
        resolve(customer.id)
      })
  })
}

const createSubscription = async (user, params) => {
  await stripe.customers.createSource(user.stripeId, {
    source: params.stripeToken
  })

  await stripe.subscriptions.create({
    customer: user.stripeId,
    items: [{ plan: "team-newyork" }]
  }).then(async subscription => {
    user.subscriber = true
    await user.save()
  })
}

module.exports = {
  saveStripeUser,
  createSubscription
}
