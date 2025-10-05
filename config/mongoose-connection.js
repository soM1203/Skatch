const mongoose = require('mongoose');
const config = require("config");

// Only connect if not already connected
if (mongoose.connection.readyState === 0) {
    mongoose.connect(config.get("MONGODB_URI"))
        .then(function() {
            console.log("MongoDB connected successfully");
        })
        .catch(function(err) {
            console.log("MongoDB connection error:", err);
        });
}

module.exports = mongoose.connection;