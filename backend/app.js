const path = require("path");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const multer = require('multer');
const { uuid } = require('uuidv4');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const productRoutes = require("./routes/product");
const userRoutes = require("./routes/user");
const MONGODB_URI = "mongodb://localhost:27017/ecart";
// const User = require('./models/user');

const fileStorage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'images');
    },
    filename: function(req, file, cb){
        cb(null, uuid().replace(/:/g, '-') + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg"){
        cb(null, true);
    }else{
        cb(null, false);
    }
}

const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: "sessions"
});


app.use(
    session({
        secret: 'somesupersecret',
        resave: true,
        saveUninitialized: true,
        store: store
    })
);

app.use((req, res, next) => {
    console.log("app.js session before", req.session)
    if(req.session && req.session.user){
        req.user = req.session.user;
        console.log("app.js session if", req.session)
    }
    else
        next();
})

// app.use((req, res, next) => {
//     console.log("app.js session before", req.session.user)
//     if(!req.session.user)
//         next();

//    console.log("app.js session after")
//     User.findById(req.session.user._id)
//         .then(user => {
//             if(!user)
//                 next();

//             req.user = user;
//             next();
//         })
//         .catch(err => {
//             console.log("err in session middleware ", err);
//             next();
//         })
// })

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.urlencoded());
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'));
app.use('/images', express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
    req.session.firstName = 'Aniruddha';
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    // headers.add("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// app.use((req, res, next) => {
//     console.log(req.session);
//     // res.locals.isAuthenticated = req.session.isLoggedIn;
// });

app.use(productRoutes);
app.use(userRoutes);


app.use((error, req, res, next) => {
    let status = error.statusCode || 500;
    let message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
});


mongoose.connect(MONGODB_URI, { useNewUrlParser: true, 
    useUnifiedTopology: true })
    .then(result => {
        const PORT = 8081;
        app.listen(PORT, () => {
            console.log(`app is listening at PORT: ${PORT}`);
        })
    })
    .catch(err => {
        console.log(err);
    });

