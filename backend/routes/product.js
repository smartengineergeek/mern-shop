const express = require('express');
const router = express.Router();

const productController = require('../controllers/product');

// create
router.post('/add-product', productController.postAddProduct);

// read
router.get('/products', productController.getProducts);

router.get('/product/:productId', productController.getProduct);

// update
router.post('/update-product/:productId', productController.postUpdateProducts);

//delete
router.delete("/product", productController.deleteProduct);



module.exports = router;