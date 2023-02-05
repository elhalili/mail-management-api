const fileFilter = (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
        cb(null, false);
        return cb(new Error('Only .pdf format allowed!'));
    } else {
        cb(null, true);
    }
}

module.exports = fileFilter;