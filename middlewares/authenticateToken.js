require('dotenv').config;
const jwt = require("jsonwebtoken");


// authenticate middlware function
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (!token) {
        console.log("JWT: lacking valid jwt");

        res.status(401)
        .json({
            error: 'JWT: lacking valid jwt'
        });

        return;
    }
  
    jwt.verify(token, process.env.SECTRET_JWT_KEY, (err, authorizedData) => {

        if (!err) {
            req.id = authorizedData.id;
            return next();
        }

        console.log("JWT: token is not verified")
        res.status(403)
        .json({
            error: 'JWT: JWT is wrong'
        });
    });
}

module.exports = authenticateToken;