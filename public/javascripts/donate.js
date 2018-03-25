var stripe = Stripe('pk_33UaI04sDTDifhenqfHDgqLc6NEtv')
var elements = stripe.elements()
var style = {
  base: {
    color: '#444',
    lineHeight: '18px',
    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    fontSmoothing: 'antialiased',
    fontSize: '16px',
    '::placeholder': {
      color: '#999'
    }
  },
  invalid: {
    color: '#fa755a',
    iconColor: '#fa755a'
  }
}
var card = elements.create('card', {style: style})

card.mount('#card-element')

card.addEventListener('change', function(event) {
  var displayError = document.getElementById('card-errors');
  if (event.error) {
    displayError.textContent = event.error.message
  } else {
    displayError.textContent = ''
  }
})

// Handle form submission.
var form = document.getElementById('payment-form');
form.addEventListener('submit', function(event) {
  console.log("ok")
  event.preventDefault()

  stripe.createToken(card).then(function(result) {
    if (result.error) {
      // Inform the user if there was an error.
      var errorElement = document.getElementById('card-errors')
      errorElement.textContent = result.error.message
    } else {
      // Send the token to your server.
      stripeTokenHandler(result.token)
    }
  })
})
