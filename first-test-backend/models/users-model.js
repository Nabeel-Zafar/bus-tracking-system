const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let users = new Schema({
    Name: {type: String},
    Email:{type: String},
    Phone:{type: String},
    Role:{type: String},
    Password:{type: String}
}, {
   collection: 'users'
})

module.exports = mongoose.model('users', users)