const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      req.uniqueSuffix = Date.now() + '-' + req.id  + '.pdf';
      cb(null, req.uniqueSuffix);
    }
});

module.exports = storage;