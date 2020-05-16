const path = require("path");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const multer = require('multer');
const { uuid } = require('uuidv4');

const productRoutes = require("./routes/product");
const userRoutes = require("./routes/user");

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

app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
app.use(
    multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);

app.use('/images', express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    // headers.add("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
})

app.use(productRoutes);
app.use(userRoutes);

app.use((error, req, res, next) => {
    let status = error.statusCode || 500;
    let message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
});

const MONGODB_URI = "mongodb://localhost:27017/ecart";
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

