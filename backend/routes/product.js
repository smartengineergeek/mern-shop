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

module.exports = router;