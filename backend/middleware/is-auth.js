const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.get('authorization');
//    console.log("authHeader ", authHeader);
    if(!authHeader){
        const error = new Error('Not authenticated');
        error.statusCode = 401;
        throw error;
    }
    const token = authHeader.split(' ')[1];
    let decodeToken;
    try{
        decodeToken = jwt.verify(token, 'somesupersecret');
//        console.log("decodeToken ", decodeToken);
    }catch(err){
        err.statusCode = 500;
        throw err;
    }
    if(!decodeToken){
        const error = new Error("Not authenticated");
        error.statusCode = 401;
        throw error;
    }
    req.userId = decodeToken.userId;
    next();
}