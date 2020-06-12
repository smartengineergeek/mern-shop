const fs = require('fs');
const path = require('path');

const Product = require('../models/product');
const User = require('../models/user');

// create
exports.postAddProduct = (req, res, next) => {
    if(!req.file){
        const error = new Error('No image provided');
        error.statusCode = 422;
        throw error;
    }
    const imageUrl = req.file.path.replace("\\", "/");
    const title = req.body.title;
    const description = req.body.description;
    const price = req.body.price;
    let creator;
    
    const product = new Product({
        title: title,
        imageUrl: imageUrl,
        description: description,
        price: price,
        userId: req.user
    });
    product
        .save()
        .then(result => {
            res.status(201).json({ 
                success: true, 
                message: 'product created successfully!',
                product: product,
                userId: { _id: creator._id, name: creator.name }
            });
        })
        .catch(err => {
            if(!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
        });
}

// read
exports.getProducts = (req, res, next) => {
    Product.find()
    .countDocuments()
    .then(count => {
        totalItems = count;
        return Product.find()       
    })
    .then(products => {
        res.status(200)
        .json({
            message: 'Fetched products successfully',
            products: products,
            totalItems: totalItems
        })
    })
    .catch(err => {
        if(!err.statusCode)
            err.statusCode = 500;
        next(err);
    });
}

// read a single product
exports.getProduct = (req, res, next) => {
    const productId = req.params.productId;
    Product.findById(productId)
    .then(product => {
        if(!product){
            const error = new Error('could not find product');
            error.statusCode = 404;
            throw error;
        }
        res.status(200)
        .json({
            message: 'Fetched product successfully',
            product: product
        })        
    })
    .catch(err => {
        if(!err.statusCode)
            err.statusCode = 500;
        next(err);
    })
}

// update
exports.postUpdateProducts = (req, res, next) => {
    const productId = req.params.productId;
    const formData = req.body;
    if(req.file){
        formData.imageUrl = req.file.path.replace("\\", "/");
    }
    Product.findById(productId)
    .then(product => { 
        if(!product){
            const error = new Error('could not find product');
            error.statusCode = 404;
            throw error;
        }
        return Product.findByIdAndUpdate({_id: productId }, formData)
    })
    .then(result => {
        // console.log(result);
    })
    .catch(err => {
        if(!err.statusCode)
            err.statusCode = 500;
        next(err);
    })
}

// delete 
exports.deleteProduct = (req, res, next) => {
    const id = req.query.id;
    Product.findById(id)
    .then(product => {
        // console.log(product);
        if(!product){
            const error = new Error("Could not find product");
            error.statusCode = 404;
            throw error;
        }
        clearImage(product.imageUrl);
        return Product.findByIdAndRemove(id);    
    })
    .then(result => {
        return Product.findById(id);
    })
    .then(result => {
        res.status(200).json({ message: 'Deleted product '});
    })
    .catch(err => {
        if(!err.statusCode)
            err.statusCode = 500;
        next(err);
    })
}

const clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err => console.log(err));    
}

// cart 
exports.postAddCart = (req, res, next) => {
    console.log("req.user ", req.user);
    // save the cart data   
    if(req.session.user){
        // console.log("product.js req.user ", req.user);
        console.log("product.js req.session.user ", req.session.user);    
    }

    const productId = req.body.productId;
    Product.findById(productId)
    .then(product => {
        return req.user.addToCart(product);
    })
    .then(result => {
        // console.log("result ", result);
        return res.status(201).json({ result: result });
        // res.redirect("/cart");
    })
    .catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    })
}

exports.getCart = (req, res, next) => {
    req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
        const products = user.cart.items;
        res.status(200).json({
            message: "fetched cart",
            cart: products,
            totalItems: products.length || 0
        })
    })
    .catch(err => {
        if(!err.statusCode)
            err.statusCode = 500;
        next(err);
    })
}

exports.deleteCart = (req, res, next) => {
    const productId = req.query.id;
    req.user
    .removeFromCart(productId)
    .then(result => {
        res.redirect('/cart');
    })
    .catch(err => {
        if(!err.statusCode)
            err.statusCode = 500;
        next(err);
    })
}

// checkout 
exports.getCheckout = (req, res, next) => {
    let products;
    let total = 0;
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            products = user.products;
            products.forEach(p => {
                total += p.quantity * p.productId.price;
            })
            return stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: products.map(p => {
                    return{
                        name: p.title,
                        description: p.description,
                        amount: p.price,
                        currency: 'usd',
                        quantity: 10
                    }
                }),
                success_url: req.protocol + "://" +req.get("host") + "/checkout/success",
                cancel_url: req.protocol + "://" +req.get("host") + "/checkout/cancel"
            })
        })
        .then(session => {
            return res.status(200).json({ 
                products: products, 
                totalSum: total,
                sessionId: session.id 
            })
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}

exports.getCheckoutSuccess = (req, res, next) => {
    console.log("success");
}
