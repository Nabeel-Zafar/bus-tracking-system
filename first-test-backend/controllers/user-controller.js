const express = require('express');
const app = express();
const UserRoute = express.Router();

// User model
let user = require('../models/users-model');

// Add User
UserRoute.route('/createUser').post((req, res, next) => {
    user.create(req.body, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
});

// Get All Users
UserRoute.route('/getAllUsers').get((req, res) => {
    user.find((error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

// Get single User
UserRoute.route('/readUser/:id').get((req, res) => {
    user.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})


// Update user
UserRoute.route('/updateuser/:id').put((req, res, next) => {
    user.findByIdAndUpdate(req.params.id, {
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

// Delete user
UserRoute.route('/deleteuser/:id').delete((req, res, next) => {
    user.findOneAndRemove(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        msg: data
      })
    }
  })
})

module.exports = UserRoute;