const mongoose = require("mongoose");

const connectionDB = (url) => {
    mongoose.connect(url);
}

module.exports = connectionDB;