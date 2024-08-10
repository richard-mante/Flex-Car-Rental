const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CarSchema = new Schema({
    brand: {
        type: String,
    },
    name: {
        type: String,
    },
    data: {
        type: String,
    }
});

const Car = new mongoose.model('car', CarSchema);
module.exports = Car;