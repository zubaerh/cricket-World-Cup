const mongoose = require('mongoose');

const teamSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    country: { type: String, required: true }
});

module.exports = mongoose.model('Team', teamSchema);