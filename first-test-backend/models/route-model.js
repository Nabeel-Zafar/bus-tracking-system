const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let route = new Schema({
    Stop1:{ID : { type: Schema.ObjectId },Name  :String, EstimatedTime: Date, ActualTime: Date},
    Stop2:{ID : { type: Schema.ObjectId },Name  :String, EstimatedTime: Date, ActualTime: Date},
    Stop3:{ID : { type: Schema.ObjectId },Name  :String, EstimatedTime: Date, ActualTime: Date},
    Bus:{ID : { type: Schema.ObjectId },Name  :String},
    Driver:{ID : { type: Schema.ObjectId },Name  :String},
}, {
   collection: 'route'
})

module.exports = mongoose.model('route', route)