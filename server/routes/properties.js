const express = require('express');
const Property = require('../models/Property');
const fs = require('fs').promises;
const path = require('path');
const router = express.Router();

const loadData = async () => {
    try {
        const basicsPath = path.join(__dirname, '../../data/property_basics.json');
        const characteristicsPath = path.join(__dirname, '../../data/property_characteristics.json');
        const imagesPath = path.join(__dirname, '../../data/property_images.json');

        console.log('Attempting to load files from:');
        console.log('Basics Path:', basicsPath);
        console.log('Characteristics Path:', characteristicsPath);
        console.log('Images Path:', imagesPath);

        const basics = JSON.parse(await fs.readFile(basicsPath));
        const characteristics = JSON.parse(await fs.readFile(characteristicsPath));
        const images = JSON.parse(await fs.readFile(imagesPath));

        console.log('Basics:', basics);
        console.log('Characteristics:', characteristics);
        console.log('Images:', images);

        const merged = basics.map((property) => {
            const char = characteristics.find((c) => c.id === property.id);
            const img = images.find((i) => i.id === property.id);
            return {
                ...property,
                ...char,
                ...img,
            };
        });

        console.log('Merged properties:', merged);
        return merged;
    } catch (error) {
        console.error('Error loading JSON data:', error);
        throw new Error('Failed to load property data');
    }
};
router.get('/', async (req, res) => {
    try {
        const { budget, location, bedrooms } = req.query;
        const properties = await loadData();

        const filtered = properties.filter((p) => {
            return (
                (!budget || p.price <= Number(budget)) &&
                (!location || p.location.toLowerCase().includes(location.toLowerCase())) &&
                (!bedrooms || p.bedrooms >= Number(bedrooms))
            );
        });

        res.json(filtered);
    } catch (error) {
        console.error('Error in /api/properties:', error.message);
        res.status(500).json({ error: 'Failed to load properties' });
    }
});

router.post('/save', async (req, res) => {
    try {
        const property = new Property({ ...req.body, userId: 'user1' });
        await property.save();
        res.json({ message: 'Property saved', property });
    } catch (error) {
        console.error('Error saving property:', error);
        res.status(500).json({ error: 'Failed to save property' });
    }
});

router.get('/saved', async (req, res) => {
    try {
        const saved = await Property.find({ userId: 'user1' });
        res.json(saved);
    } catch (error) {
        console.error('Error fetching saved properties:', error);
        res.status(500).json({ error: 'Failed to fetch saved properties' });
    }
});

module.exports = router;