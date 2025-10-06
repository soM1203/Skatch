const mongoose = require('mongoose');
const config = require("config");

// Use environment variable first, then config
const MONGODB_URI = process.env.MONGODB_URI || config.get("MONGODB_URI");

// Only connect if not already connected
if (mongoose.connection.readyState === 0) {
    mongoose.connect(MONGODB_URI)
        .then(function() {
            console.log("MongoDB connected successfully");
        })
        .catch(function(err) {
            console.log("MongoDB connection error:", err);
        });
}

module.exports = mongoose.connection;