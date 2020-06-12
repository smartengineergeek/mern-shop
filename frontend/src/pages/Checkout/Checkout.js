import React, { useEffect } from 'react'
import { StripeProvider, Elements } from 'react-stripe-elements'
import CheckoutForm from './CheckoutForm.js'

const Checkout = ({ selectedProduct, history }) => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <StripeProvider apiKey="pk_test_05w1UMm37UTSKmtDTNZgzMTI00mSfQXY2V">
      <Elements>
        <CheckoutForm selectedProduct={selectedProduct}  history={history} />
      </Elements>
    </StripeProvider>
  )
}

export default Checkout;