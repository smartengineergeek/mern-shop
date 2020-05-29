const fs = require('fs');
const path = require('path');

const Cart = require('../models/cart');
const User = require('../models/user');

exports.postAddCart = (req, res, next) => {
    // save the cart data   
    let cart = new Cart({
        productId: req.body.productId,
        price: req.body.price,
        userId: req.userId,
        quantity: req.body.quantity,
        image: req.body.imageUrl
    });

    cart
        .save()
        .then(result => {
            return User.findById(req.userId)
        })
        .then(user => {
            user.cart.push(cart);
            return user.save();
        })
        .then(result => {
            res.status(201).json({ 
                message: 'cart created!', 
                cart: cart,
                _id: result._id 
            });
        })
        .catch(err => {
            if(!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
        })
}

exports.getCart = (req, res, next) => {
    Cart.find()
    .countDocuments()
    .then(count => {
        totalItems = count;
        return Cart.find()
    })
    .then(cart => {
        res.status(200).json({
            message: "fetched cart",
            cart: cart,
            totalItems: totalItems
        })
    })
    .catch(err => {
        if(!err.statusCode)
            err.statusCode = 500;
        next(err);
    })
}

exports.deleteCart = (req, res, next) => {
    console.log("test")
    const id = req.query.id;
    console.log("id ", id);
    Cart.findById(id)
    .then(cart => {
        if(!cart){
            const error = new Error("could not find cart");
            error.statusCode = 404;
            throw error;
        }
        return Cart.findByIdAndRemove(id);
    })
    .then(result => {
        Cart.findById(id);
    })
    .then(result => {
        res.status(200).json({
            message: 'Cart deleted'        
        })
    })
    .catch(err => {
        if(!err.statusCode)
            err.statusCode = 500;
        next(err);
    })
}