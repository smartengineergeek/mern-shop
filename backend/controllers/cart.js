const stripe = require('stripe')("pk_test_05w1UMm37UTSKmtDTNZgzMTI00mSfQXY2V");

const User = require('../models/user');
const Product = require('../models/product');


exports.getCheckout2 = (req, res, next) => {
    return res.status(200).json({"success": true });
}


exports.postCharge = async(req, res, next) => {
    try {
        const { amount, source, receipt_email } = req.body
    
        const charge = await stripe.charges.create({
          amount,
          currency: 'usd',
          source,
          receipt_email
        })
    
        if (!charge) throw new Error('charge unsuccessful')
    
        res.status(200).json({
          message: 'charge posted successfully',
          charge
        })
      } catch (error) {
        res.status(500).json({
          message: error.message
        })
      }
}