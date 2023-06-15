const mongoose = require('mongoose');

const wordSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Word', wordSchema);