const express = require('express');
const app = express();
const LocationRoute = express.Router();
const mongoose = require("mongoose");
// Location model
let location = require('../models/location-model');

// Add Location
LocationRoute.route('/createLocation').post((req, res, next) => {
    location.create(req.body, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
});

// Get All Locations
LocationRoute.route('/getAllLocations').get((req, res) => {
    location.find((error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

// Get single Location
LocationRoute.route('/readLocation/:id').get((req, res) => {
    location.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})


// Update Location
LocationRoute.route('/updatelocation/:id').put((req, res, next) => {
    location.findByIdAndUpdate(req.params.id, {
    $set: req.body
  }, (error, data) => {
    if (error) {
      return next(error);
      console.log(error)
    } else {
      location.findById(req.params.id, (error, location) => {
        if (error) {
          return next(error)
        } else {
          res.json(location)
        }
      })
      console.log('Data updated successfully')
    }
  })
})

// Delete Location
LocationRoute.route('/deletelocation/:id').delete((req, res, next) => {
  location.findByIdAndDelete(mongoose.Types.ObjectId(req.params.id), (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        msg: data
      })
    }
  })
})

module.exports = LocationRoute;