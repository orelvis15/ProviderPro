var mongoose = require('mongoose');

var providerSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    }    
});

const Provider = mongoose.model('Provider', providerSchema);

module.exports = Provider;
