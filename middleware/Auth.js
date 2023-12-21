const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors")
const jwt = require("jsonwebtoken");
const Group = require("../models/groupModels");
const User = require("../models/userModels");
var address = require('address');
const UserAgent = require("user-agents");
const { response } = require("express");



exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
    try {
   
    const ipaddress = address.ip();

    const userAgents = new UserAgent();
    const userAggent = userAgents;
    
    const { token } = req.cookies;
    
    console.log(token);
    if (!token) {
        req.flash('error',"plesae Login to access this resource");
        return next(res.redirect('/login'));
    }
      
    const decodeData = jwt.verify(token, process.env.JWT_SECRET);


    req.user = await User.findById(decodeData.id);
 
    if (req.headers['user-agent'] != req.user.userAggent && ipaddress != req.user.userAggent) {
        res.cookie("token", null, {
            expires: new Date(Date.now()),
            httpOnly: true,
        });
        req.flash('error', 'Unauthorized access. Please login again.');
        return next(res.redirect('/'));
    }
    next(); 
}
    catch (err) {
        console.error('Authentication Error:', err);
    }
})


exports.grooupId = catchAsyncErrors(async (req, res, next) => {
    const { token } = req.cookies;
    console.log(token);
    if (!token) {
        req.flash('error',"plesae Login to access this resource");
        return next(res.redirect('/login'));
    }
      
    const decodeData = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await Group.findById(decodeData.id);

    next();
})

exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorHandler(
                    `Role: ${req.user.role} is not allowed to access this resouce `,
                    403
                )
            );
        }

        next();
    }
}




