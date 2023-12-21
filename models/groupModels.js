const mongoose = require("mongoose");



const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Your Name"],   
    },
    startingDate: {
        type: Date,
        default: Date.now,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      
      }
});



module.exports = mongoose.model("Group", groupSchema);

