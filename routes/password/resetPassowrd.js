const express = require('express');
const bcrypt = require('bcryptjs')
const { User } = require('../../models');

const route  = express.Router();

route.post('/:id', async (req, res) => {

    try {
        // get the user from db
        const user = await User.findByPk(req.params.id);

        if (!user) {
            res.status(400)
            .json({
                error: 'User does not exist'
            });
    
            return;
        }
        
        // reset the password: default password is the id itself
        user.password = await bcrypt.hash(user.id, 10);
    
        const updatedUser = await user.save();
    
        res.json(updatedUser);
    } catch (err) {
        console.log(`POST /reset-password/${req.params.id}: ` + err);

        res.status(500)
        .json({
            error: 'can not reset password try later'
        });
    }
});

module.exports = route;