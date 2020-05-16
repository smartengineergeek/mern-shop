const express = require('express');
const router = express.Router();
const { body } = require('express-validator/check');

const User = require('../models/user');
const userController = require('../controllers/user');

router.post('/signup', [
    body('username')
        .trim()
        .isLength({ min: 5 })
        .withMessage('Please enter a valid username with min 5 characters')
        .custom((value, { req}) => {
            return User.findOne({ username: value }).then(userDoc => {
                if(userDoc){
                    return Promise.reject('Username already exists!');
                }
            })
        }),
    body('password')
        .trim()
        .isLength({ min: 5 })
        .withMessage('Please enter a valid password with min 5 characters')        
], userController.postSignup);

router.post('/login', userController.postLogin);

module.exports = router;