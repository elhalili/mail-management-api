require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs')
const { User } = require('../../models');
const isAdmin = require('../../middlewares/isAdmin');

const route  = express.Router();

// get all users
route.get('/', isAdmin, async (req, res) => {
    try {
        const users = await User.findAll();
        console.log(`GET /users: Done`);

        res.json(users);
    } catch (err) {
        console.log(`GET /users: can not get users`);

        res.status(500)
        .json({
            err: `can not get users, try later`
        });
    }
});

// get a user by id
route.get('/:id', isAdmin, async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        console.log(`GET /users/${req.params.id}: Done`);
    
        if (user) res.json(user);
        else res.json({});

    } catch (err) {
        console.log(`GET /users/${req.params.id}: ` + err);

        res.status(500)
        .json({
            err: `can not get the user, try later`
        });
    }
})

//create a new user
route.post('/', isAdmin, async (req, res) => {

    // new user data
    const userData = {
        id: req.body.id,
        name: req.body.name,
        username: req.body.name.split(/\s/ ).join('.').toLowerCase(),
        role: 'normal',
        isActive: true
    };

    // hashing the password with storing the new user
    try {
        userData.password = await bcrypt.hash(userData.id, 10);

        const user = await User.create(userData);
        console.log('POST /users: user has been created');

        res.json(user)
    } catch (err) {
        console.log('POST /users: ', err);
                
        res.status(503)
        .json({error: 'Can not create user'});
    }
});

// update a user
route.put('/:id', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);

        if (!user) {
            res.status(400)
            .json({
                error: 'User does not exist'
            });

            return;
        }

        user.name = req.body.name;
        user.username = req.body.name.split(/\s/ ).join('.').toLowerCase();
        user.isActive = (req.body.isActive === 'true')? true: false;

        const updatedUser = await user.save();
        console.log(`PUT /users/${req.params.id}: done`);

        res.json(updatedUser);
        
    } catch (err) {
        console.log(`PUT /users/${req.params.id}: ` + err);

        res.status(500).json({
            error: 'can not update the user'
        });
    }
});

// delete a user
route.delete('/:id', async (req, res) => {
    // can not delete the default admin
    if (req.params.id === process.env.ADMIN_ID) {

        res.status(400)
        .json({error: 'can not delete the administrator'});
        return;
    }
    // delete the user
    try {
        await User.destroy({
            where: {
                id: req.params.id
            }
        });
        console.log('DELETE /users: the user has been deleted');

        res.json({status: 'Done'})
    } catch (err) {
        console.log('DELETE /users: ' + err);

        res.status(500)
        .json({error: `Can not delete the user`});
    }
});

module.exports = route;