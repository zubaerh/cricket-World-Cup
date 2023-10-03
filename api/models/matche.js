const mongoose = require('mongoose');

const matcheSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    date: { type: Date, required: true },
    TeamA_ID: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
    TeamB_ID: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
    Venue: { type: String, required: true }
});

module.exports = mongoose.model('Matche', matcheSchema);