const express = require('express');
const bcrypt = require('bcryptjs')
const { User } = require('../../models');

const route  = express.Router();

route.post('/:id', async (req, res) => {
    try {
        // constraint: the user itself who can change its password
        if (req.params.id !== req.id) {
            res.status(400)
            .json({
                error: 'only the user who can change its password'
            });
    
            return;
        }
        
        // get the user from db
        const user = await User.findByPk(req.id);
        // change the password
        user.password = await bcrypt.hash(req.body.password, 10);
        const updatedUser = await user.save();
    
        res.json(updatedUser);
    } catch (err) {
        console.log(`POST /${req.params.id}: ` + err);

        res.status(500)
        .json({
            error: 'Can not change the password, try later'
        });
    }
})

module.exports = route;