const { User } = require('../models');

const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.id);
        if (user.role === 'admin') return next();

        res.status(403).json({ error: 'You are not admin' });
    }
    catch(err) {
        console.log('Auth: Can not check if user is admin');

        res.status(500)
        .json({
            error: 'Can not check of you are admin'
        })
    }
}

module.exports = isAdmin;