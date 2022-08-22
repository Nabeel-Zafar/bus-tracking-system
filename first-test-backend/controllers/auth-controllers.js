
let Users = require('../models/users-model');
const jwt = require('jsonwebtoken');

exports.login=(req, res)=>{
    Users.findOne({Email : req.body.username, Password: req.body.password})
  .then((user) => {
      console.log("user " , user);
      if(!user) {
          res.status(500).send({status: false, message : "user not found"});                
      } else {
        const token = jwt.sign({ UID: user._doc._id , expiresIn: '1h' }, process.env.JWT_SECRET);
        res.status(200).json({
          message: "Successfully Logged In",
          status : true,
          data: {...user._doc, token: token }
        });
          
      }
  })
}
