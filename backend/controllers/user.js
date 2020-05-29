const { validationResult } = require('express-validator/check');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.postSignup = (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    const errors = validationResult(req);
    // console.log('msg', errors.array());
    if(!errors.isEmpty()){
        // console.log(errors.array());
        const error = new Error(' Validation failed ');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    bcrypt
        .hash(password, 12)
        .then(hashedPw => {
        const user = new User({
            username: username,
            password: hashedPw
        })
        return user.save();
    })
    .then(result => {
        res.status(201).json({ 
            message: 'user created!', 
            userId: result._id 
        });
    })
    .catch(err => {
        if(!err.statusCode)
            err.statusCode = 500;
        
        next(err);
    });
}

// for user login
exports.postLogin = (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

//    console.log("username", username, "password", password);
    let loadedUser;

    User.findOne({ username: username })
    .then(user => {
        if(!user){
            let error = new Error('a user with this username already exists!');
            error.statusCode = 401;
            throw error;
        }
        loadedUser = user;
        return bcrypt.compare(password, user.password);
    })
    .then(isEqual => {
        if(!isEqual){
            const error = new Error('Wrong password');
            error.statusCode = 401;
            throw error;
        }
        const token = jwt.sign(
            {
                username: loadedUser.username,
                userId: loadedUser._id.toString()
            },
            'somesupersecret',
            { expiresIn: '4h' }
        );
        res.status(200).json({ username: username, token: token, userId: loadedUser._id.toString() })
    })
    .catch(err => {
        if(!err.statusCode)
            err.statusCode = 500;
        next(err);
    })
}

