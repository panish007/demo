const User = require("../models/userModels.js");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/errorhandler");
const sendEmail = require("../utils/sendEmail");
const sendToken = require("../utils/jwtToken");
var ls = require('local-storage');
var address = require('address');
const UserAgent = require("user-agents");



exports.registerUser = async (req, res, next) => {
    try {
        const sessionId = Math.random().toString(36).substring(2);
       
     const ipaddress = address.ip();

     const userAgents = new UserAgent();
     const userAggent = req.headers['user-agent']

    const { name, email, password, confirmPassword, mobileNo } = req.body;
    const checkEmail = await User.findOne({ email});
    // const checkEmail = await User.findOne({email});
        
        //  const existingtoken = ls.get('sessionId');
        //  console.log(existingtoken);
    if (!name) {
        return res.status(200).json({ flag: 0, msg: 'Please enter your Name' });
    }if (!email) {
        return res.status(200).json({ flag: 0, msg: 'Please enter your email' });
    } 
    if (!mobileNo) {
        return res.status(200).json({ flag: 0, msg: 'Please enter your mobile Number' });
    }
    if (mobileNo.length != 10) {
        return res.status(200).json({ flag: 0, msg: 'Invalid Mobile Number' });
    }
    if (!password) {
        return res.status(200).json({ flag: 0, msg: 'Please enter your password' });
    }if (!confirmPassword) {
        return res.status(200).json({ flag: 0, msg: 'Please enter your confirmpassword' });
    }
    
   
    if (confirmPassword != password) {

        return res.status(200).json({ flag: 0, msg: 'password does not match' });
        // return next(new ErrorHandler("Password Does Not Match", "401"));
    }
    if (password.length < 6) {
        return res.status(200).json({ flag: 0, msg: 'Password should be at least 6 characters long' });
    }
   if(checkEmail) {
    return res.status(200).json({ flag: 0, msg: 'User already Exists' });
   }
   

    const user = await User.create({
        name, email, password, confirmPassword, mobileNo,ipaddress,userAggent
    });


    // try {
    //     await sendEmail({
    //         email: user.email,
    //         subject: "Activate Your Account",
    //         message: `Hello ${user.name}, please click on the link to activate your account:${activationUrl}`,
    //     });
    //     // res.status(201).json({
    //     //     success: true,
    //     //     message: `please check your email:- ${user.email} to activate your account!`,
    //     // });

    // } catch (err) {
    //     next(new ErrorHandler(err.message, 500));
    // }    
 
   
    await sendToken(user, 201, res);
    res.status(201).json({ flag: 1, msg: 'successfully activated your account', data: user });
 } catch (error) {
        console.error('Error creating contact:', error);
        res.status(200).json({ flag: 0, msg: 'Internal server error' });
    }
};

exports.home = catchAsyncErrors(async (req, res, next) => {
    
    if(req.flags == 1) {
        res.cookie("token", null, {
            expires: new Date(Date.now()),
            httpOnly: true,
        });
    }
    await res.render('index');
});




exports.loginUser = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email) {
        return res.status(200).json({ flag: 0, msg: 'Please enter your  email' });
    }if(!password){
        return res.status(200).json({ flag: 0, msg: 'Please enter your password' });
    }

    // Check if the user exists with the provided email
    const user = await User.findOne({ email: email}).select("+password");
   

    console.log(user);
    if (!user) {
        return res.status(200).json({ flag: 0, msg: 'Invalid Credentials' });
    }
 

    // Check if the entered password matches the stored password
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
        return res.status(200).json({ flag: 0, msg: 'Invalid Credentials' });
    }
    
   const ipaddress = address.ip();


   const userAgents = new UserAgent();
     const userAggent = userAgents.toString();

   user.ipaddress = ipaddress;  
   user.userAggent = req.headers['user-agent'];
    // user.tokens = [];
     await user.save();          
    


    await sendToken(user, 201, res);
    return res.status(200).json({ flag: 1, msg: 'Successfully logged in' });
};

// If everything is fine, send the authentication token
//sendToken(user, 200, res);



exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
    const error = await req.flash("error");
    if (req.cookies.token) {
 
       res.render('user/contact',error);
    }
    const user = await User.findById(req.user.id);

    res.status(200).json({
        flag: 1,
        msg: 'successfully Login to Account!!',
        data: user
    });
});


exports.getLogin = catchAsyncErrors(async (req, res, next) => {
    const error = await req.flash("error");
    if (req.cookies.token) {
        res.redirect('/dashboard');
    }
    const messages = await req.flash("success");
  

    res.render('user/login', { messages, error })
    // res.render('user/login', { messages, error });
})

exports.getRegister = catchAsyncErrors(async (req, res, next) => {
    if (req.cookies.token) {
        res.redirect('/dashboard');
    }
    const messages = await req.flash("success");
    const error = await req.flash("error");

    res.render('user/register', { messages, error });
})




exports.logout = catchAsyncErrors(async (req, res, next) => {
    try {
         
    const user = await User.findById(req.user.id);

    user.tokens = [];
    await user.save();
    console.log(user);
        res.cookie("token", null, {
            expires: new Date(Date.now()),
            httpOnly: true,
        });

        res.redirect('/');
    } catch (err) {
        req.flash('error', err.message);
    }
});



exports.logoutpage = catchAsyncErrors(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    await res.render('index');
});