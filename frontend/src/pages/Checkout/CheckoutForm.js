import React, { useState } from 'react';
import {
    CardNumberElement,
    CardExpiryElement,
    CardCvcElement,
    injectStripe
} from 'react-stripe-elements';
import axios from 'axios'
import './CheckoutForm.css'
import { Link } from 'react-router-dom';

const CheckoutForm = ({ selectedProduct, stripe, history }) => {
    if(selectedProduct === null) history.push("/");

    console.log("selectedProduct ", selectedProduct, " history ", history)
    const [receiptUrl, setReceiptUrl] = useState("");
    
    const handleSubmit = async event => {
        event.handleDefault();

        const { token } = await stripe.createToken();

        const order = await axios.post('http://localhost:8081/stripe/charge', {
            amount: selectedProduct.price.toString().replace('.', ''),
            source: token.id,
            receipt_email: 'customer@example.com'
        })
      
        setReceiptUrl(order.data.charge.receipt_url)
    }

    if (receiptUrl) {
        return (
          <div className="success">
            <h2>Payment Successful!</h2>
            <a href={receiptUrl}>View Receipt</a>
            <Link to="/">Home</Link>
          </div>
        )
    }

    return (
        <div className="checkout-form">
          <p>Amount: ${selectedProduct.price}</p>
          <form onSubmit={handleSubmit}>
            <label>
              Card details
              <CardNumberElement />
            </label>
            <label>
              Expiration date
              <CardExpiryElement />
            </label>
            <label>
              CVC
              <CardCvcElement />
            </label>
            <button type="submit" className="order-button">
              Pay
            </button>
          </form>
        </div>
    )
}    

export default injectStripe(CheckoutForm)
