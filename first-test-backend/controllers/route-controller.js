const express = require('express');
const app = express();
const Route = express.Router();
const mongoose = require("mongoose");

// Route model
let route = require('../models/route-model');

// Add Route
Route.route('/createRoute').post((req, res, next) => {
    route.create(req.body, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
});

// Get All Routes
Route.route('/getAllRoutes').get((req, res) => {
    route.find({"Stop3.ActualTime": {$exists: false}},(error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

// Get single Routes
Route.route('/readRoute/:id').get((req, res) => {
    route.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})


// Update Routes
Route.route('/updateRoute/:id').put((req, res, next) => {
    route.findByIdAndUpdate(req.params.id, {
    $set: req.body
  }, (error, data) => {
    if (error) {
      return next(error);
      console.log(error)
    } else {
      res.json(data)
      console.log('Data updated successfully')
    }
  })
})

// Delete Routes
Route.route('/deleteRoute/:id').delete((req, res, next) => {
    route.findByIdAndDelete(mongoose.Types.ObjectId(req.params.id), (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        msg: data
      })
    }
  })
})

// get user route
Route.route('/getUserRoute').get((req, res, next) => {
  // console.log(req.user, "req.user")

  route.findOne({"Driver.ID" : req.user._id, "Stop3.ActualTime": {$exists: false}}, (error, data) => {
  if (error) {
    return next(error);
  } else {
    res.status(200).json({
      status: true,
      data
    })
  }
})
})

Route.route('/updateUserRoute/:id').put((req, res, next) => {
  // console.log(req.user, "req.user", req.params.id, req.body)
  route.findOneAndUpdate({_id: mongoose.Types.ObjectId(req.params.id)}, req.body, (error, data) => {
  if (error) {
    return next(error);
  } else {
    res.status(200).json({
      status: true,
      data
    })
  }
})
})

module.exports = Route;