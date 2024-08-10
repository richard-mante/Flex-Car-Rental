const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        require: true,
    },
    phoneNumber: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    vehicles: {
        type: Array,
        required: false
    },
    savedVehicles: {
        type: Array,
        required: false
    }
}, {
    versionKey: false,
});

const User = new mongoose.model('user', UserSchema);
module.exports = User;