const express = require('express');
const router = express.Router();

const productController = require('../controllers/product');
const isAuth = require('../middleware/is-auth');

// create
router.post('/add-product', isAuth, productController.postAddProduct);

// read
router.get('/products', productController.getProducts);

router.get('/product/:productId', isAuth, productController.getProduct);

// update
router.post('/update-product/:productId', isAuth, productController.postUpdateProducts);

//delete
router.delete("/product", isAuth, productController.deleteProduct);

//cart
router.post('/add-cart', isAuth, productController.postAddCart);

router.get('/cart', isAuth, productController.getCart);

router.delete('/cart', isAuth, productController.deleteCart);

router.get("/checkout", isAuth, productController.getCheckout);

router.get("/checkout/success", isAuth, productController.getCheckoutSuccess);

module.exports = router;