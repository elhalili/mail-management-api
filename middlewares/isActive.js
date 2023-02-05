const { User } = require('../models');

const isActive = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.id);

        if(!user) res.json({ error: 'This is user is not existed anymore' });
        else if (user.isActive) return next();
        else res.json({ error: 'This is user is not active in the current moment' });

    } catch (err) {
        res.status(500)
        .json({
            error: 'try later'
        });
    }
}

module.exports = isActive;