const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let bus = new Schema({
    BusName:{type: String}
}, {
   collection: 'bus'
})

module.exports = mongoose.model('bus', bus)