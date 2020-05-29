const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/is-auth');

const cartController = require('../controllers/cart');

router.post('/add-cart', isAuth, cartController.postAddCart);

router.get('/cart', isAuth, cartController.getCart);

router.delete('/cart', isAuth, cartController.deleteCart);

module.exports = router;