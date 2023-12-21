const mongoose = require("mongoose");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        
        // required: [true, "Please Enter Your Name"],
        required:true
    },
    email: {
        type: String,
        required:true,   
    },
    password: {
        type: String,
        select:false
    },
    confirmPassword: {
        type: String,
    },
    mobileNo: {
        type: String,
        required: true,
        //validate: [validator.isMobilePhone, "please Enter a valid Mobile Number"]
    },
    logIn:{
      type:Boolean
    },sessionId:{
        type:String
    },ipaddress:{
        type:String
    },userAggent:{
        type:String
    },
    tokens:[{
       token:{
          type:String,
       }
    }],
    role: {
        type: String,
        default: "user",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },

});


userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    this.confirmPassword = undefined;
    
})

userSchema.methods.getJWTToken =  function () {
    return jwt.sign({ id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    })
}

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};




module.exports = mongoose.model("User", userSchema);


// exports.loginUser = catchAsyncErrors(async (req, res, next) => {

//     const { name, email, password } = req.body;
//     const user = await User.find({ $or: [{ name: name }, { email: email }] })

//     if (!user) {
//         return next(new ErrorHandler("Please Enter your Name or email", 401));
//     }

//     const isPasswordMatch = await bcrypt.compare(password, user[0].password);

//     if (!isPasswordMatch) {
//         return next(new ErrorHandler("Invalid email or password", 401));
//     }

//     res.status(200).json({
//         success: true,
//         user,
//     })
//     //sendToken(user, 200, res);

// });