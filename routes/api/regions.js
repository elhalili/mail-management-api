const express = require('express');
const { Region } = require('../../models');

const route  = express.Router();

// get all regions
route.get('/', async (req, res) => { 
    try {
        const regions = await Region.findAll();        
        res.json(regions);

        console.log('GET /regions: done');
    } catch (err) {
        console.log('GET /regions: can not get regions => ', err);

        res.status(500)
        .json({
            error: 'can not get regions, try later'
        });
    }
});

// get a region by id
route.get('/:id', async (req, res) => {
    try {
        const region = await Region.findByPk(req.params.id);
        if (region) res.json(region);
        else res.json({});

        console.log(`GET /regions/${req.params.id}: done`);
    } catch (err) {
        console.log(`GET /regions/${req.params.id}: ` + err);

        res.json({
            error: 'can not get the region, try later'
        });
    }
})

// create a region
route.post('/', async (req, res) => {
    try {
        const {name, code} = req.body;
        const region = await Region.create({
            id: code,
            name
        });
        res.json(region);

        console.log('POST /regions: a region has been created');
    } catch (err) {
        console.log('POST /regions: ', err);

        res.status(500)
        .json({
            error: 'can not create a region try later'
        });
    }
});

// update a regions
route.put('/:id', async (req, res) => {
    try {
        console.log(`PUT /regions${req.params.id}: `);

        const region = await Region.findByPk(req.params.id);
        // check of a region is existed
        if (!region) {
            res.json({
                error:'the region does not exist'
            });

            return;
        }

        if (req.body.name) {
            region.name = req.body.name;

            const updatedRegion = await region.save();
            res.json(updatedRegion);
        }

    } catch (err) {
        console.log(`PUT /regions/${req.params.id}: ` + err);

        res.json({
            error: 'can not update the region, try later'
        });
    }
})

// delete a region
route.delete('/:id', async (req, res) => {
    try {
        await Region.destroy({
            where: {
                id: req.params.id
            }
        });
        console.log(`DELETE /regions/${req.params.id}: user has been deleted`);

        res.json({status: 'deleted'})
    } catch (err) {
        console.log(`DELETE /regions/${req.params.id}: ` + err);

        res.status(500)
        .json({error: `Can not delete the region`});
    }
});

module.exports = route;