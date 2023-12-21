const mongoose = require("mongoose");



const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Your Name"],
       
    },
    mobileNo: {
        type: String,
        required: [true, "Please Enter Your Mobile Number"],
        trim:true
        //validate: [validator.isMobilePhone, "please Enter a valid Mobile Number"]
    },group:{   
        type:String,
    },
    startingDate: {
        type: Date,
        default: Date.now,
    },
    endingDate: {
        type: Date,
        //required: [true, "Please Enter Your Ending Date"],
    },
    groupId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      
      },
      
});



module.exports = mongoose.model("Contact", contactSchema);

