const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Location = new Schema({
    LocationName: {type: String}
}, {
   collection: 'Location'
})

module.exports = mongoose.model('Location', Location)