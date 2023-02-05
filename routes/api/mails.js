const fs = require('fs');
const express = require('express');
const { Mail, User, Region } = require('../../models');
const multer = require('multer');
const storage = require('../../middlewares/storageMulter');
const fileFilter = require('../../middlewares/fileFilter');

// multer middelware
const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter
});
const route  = express.Router();

// get all mails
route.get('/', async (req, res) => {
    try {
        const mails = await Mail.findAll();
        res.json(mails);

    } catch (err) {
        console.log('GET /mails: failed to load all inboxes => ', err);

        res.status(500)
        .json({
            error: 'failed'
        });
    }
});

// get a mail by id
route.get('/:id', async (req, res) => {
    try {
        const mail = await Mail.findByPk(req.params.id);
        // check if a mail is existed
        if (!mail) {
            res.status(400)
            .json({
                error: 'mail does not exist'
            });

            return;
        }

        res.json(mail);

    } catch (err) {
        console.log('GET /mails/:id: failed to load => ', err);

        res.status(500)
        .json({
            error: 'can not get mail try later'
        });
    }
});

// create a new mail
route.post('/', upload.single('document'), async (req, res) => {
    try {
        const region = await Region.findByPk(req.body.region_id);

        if (!region) {
            res.status(400)
            .json({
                error: 'region does not exist'
            });

            // delete the doc
            fs.unlink(req.file.path, async (err) => {
                if (err) {
                    throw err;
                }
                
                console.log(`Delete File successfully`);    
            });

            return;
        }

        const mailData = {
            region_id: region.id,
            creator: req.id,
            last_modifier: req.id,
            type: req.body.type,
            reference: req.body.reference,
            object: req.body.object,
            description: req.body.description,
            releaseDate: req.body.releaseDate,
            documentPath: req.file.path
        }

        const mail = await Mail.create(mailData);

        res.json(mail);

    } catch (err) {
        console.log(`POST /mails: ` + err);

        res.status(500)
        .json({
            error: 'can not create a mail'
        });
    }
});

// update a mail
route.put('/:id', async (req, res) => {
    try {
        const mail = await Mail.findByPk(req.params.id);
        // check if a mail is existed
        if (!mail) {
            res.status(400)
            .json({
                error: 'mail does not exist'
            });
    
            return;
        }

        mail.region_id = req.body.region_id;
        mail.last_modifier = req.id;
        mail.type = req.body.type;
        mail.reference = req.body.reference;
        mail.object = req.body.object;
        mail.description = req.body.description;
        mail.releaseDate = req.body.releaseDate;

        const updatedMail = await mail.save();

        res.json(updatedMail);

    } catch (err) {
        console.log(`PUT /mails/${req.params.id}: ` + err);

        res.status(500)
        .json({
            error: 'can not update the mail, try later'
        });
    }
}); 

route.delete('/:id', async (req, res) => {
    try {
        const mail = await Mail.findByPk(req.params.id);
        // check if a mail is existed
        if (!mail) {
            res.status(400)
            .json({
                error: 'mail does not exist'
            });
    
            return;
        }
        // get the current user
        const user = await User.findByPk(req.id);
    
        if ((user.role !== 'admin') && (user.id !== mail.creator)) {
            res.status(400)
            .json({
                error: 'permission not allowed'
            });
    
            return;
        }
        // delete the mail from server
        fs.unlink(mail.documentPath, async (err) => {
            if (err) {
                throw err;
            }
            // delete the  mail from db
            await mail.destroy();
            console.log(`Delete File successfully`);

            res.json({
                status: 'done'
            });
        });
    } catch (err) {
        console.log(`DELETE /mails/${req.params.id}: ` + err);

        res.status(500)
        .json({
            error: 'can not delete the mail, try later'
        });
    }
});

module.exports = route;