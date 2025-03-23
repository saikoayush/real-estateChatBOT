const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
    userId: String,
    propertyId: String,
    title: String,
    price: Number,
    location: String,
    bedrooms: Number,
    bathrooms: Number,
    size: Number,
    image: String,
});

module.exports = mongoose.model('Property', PropertySchema);