const Jwt = require('jsonwebtoken');
let User = require('../models/users-model');
const mongoose = require("mongoose");

// var Ortosroutes_dictionary = require('../services/Ortosroutes_dictionary')
// const RolesRepository = require("../db-repositories/RolesRepository");

let allowed_to_all_authorized_users = [
    "/api/user/changePassword",
    "/api/branch/getAllBranch",
    "/api/section/getAllSections/:BranchID?",
];

let unrestricted_routes = [
    "/api/user/login",
    "/api/user/createAdminUser",
    "/api/user/send_email_forgot_password",
    "/api/user/send_email_forgot_password"  
];
exports.authMiddleware = function(req, res, next){
    let token = req.get('Authorization')?.split(" ")[1];
    // console.log("token",token)
    if(token){

        // console.log("tokentokentoken",token)
        // console.log("process.env.jwtKey",process.env.JWT_SECRET)

        var decoded = Jwt.verify(token, process.env.JWT_SECRET);
        // console.log("decoded._id",decoded)

        if(decoded.UID){
            User.findById(mongoose.Types.ObjectId(decoded.UID)).then(async function (data) {       
                // console.log("data auth" , data)
                if(data){
                    let _Title = null
                    req.user = data;
                    next()
            
                }
                else {
                    res.status(401).send({ status : false, message : "Not Authorized" });
                }
            }, function(err){
                res.status(401).send({ status : false, message : "Not Authorized", error : err });
            });
        }
    } 
    else {
        res.status(401).send({ status : false, message : "Not Authorized" });
    }
}