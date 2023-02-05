require('dotenv').config();
const express = require('express');
const Ddos = require("ddos");
const cors = require("cors");
const bodyParser = require('body-parser');
const { sequelize } = require('./models');
const authenticateToken = require('./middlewares/authenticateToken');
const isAdmin = require('./middlewares/isAdmin');
const isActive = require('./middlewares/isActive');

const app  = express();
const ddos = new Ddos({ burst: 10, limit: 15 });

// make uploads folder static for getting the inserted mails
app.use('/uploads/', express.static('uploads'));
app.use(ddos.express);
app.use(cors({
    origin: '*'
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/login', require('./routes/login'));
app.use('/password/', authenticateToken);
app.use('/password/reset-password', isAdmin, require('./routes/password/resetPassowrd'));
app.use('/password/change-password', isActive, require('./routes/password/changePassword'));
app.use('/api/', authenticateToken, isActive);
app.use('/api/users', isAdmin, require('./routes/api/users'));
app.use('/api/regions', require('./routes/api/regions'));
app.use('/api/mails', require('./routes/api/mails'));

// start the server
app.listen(process.env.PORT, () => {
    // connect data base
    sequelize.authenticate()
    .then(() => {
        console.log(`MAIL API: Database is connected!`);
    })
    .catch(((err) => {
        console.log(`MAIL API: error at connecting database!`, err);
    }));

    console.log(`MAIL API: the API is running at ${process.env.PORT}`);
});