require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models');
const route  = express.Router();

route.post('/', async (req, res) => {
    const {username, password} = req.body;

    // retrive the user from db by username
    try {
        const user = await User.findOne({ where: {username: username} });
        
        // check if the user exists
        if(!user) {
            res.status(400)
            .json({
                error: 'LOGIN: user does not exist'
            });

            return;
        }

        // compare the hash
        const result = await bcrypt.compare(password, user.password);
        if (!result) {
            console.log('LOGIN: password is wrong');

            res.status(400)
            .json({
                error: 'LOGIN: password wrong'
            });

            return;
        }

        // generate the jwt token for the user
        const payload = { 
            exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24),
            id: user.id
        };
        jwt.sign(payload, process.env.SECTRET_JWT_KEY, { algorithm: 'HS256' }, (error, token) => {
            if(error) {
                console.log('JWT error at generating phase: ', error);

                res.status(500)
                .json({
                    error: 'Try later'
                });

                return;
            }

            console.log('JWT: token has been generated');
            res.json({token: token});
        });

    } catch (err) {
        console.log('LOGIN: ' + err);

        res.json({
            error: 'try later'
        });
    }
});

module.exports  = route;
