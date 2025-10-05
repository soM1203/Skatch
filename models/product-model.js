const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    image: Buffer,
    imageType: String,
    name: String,
    price: Number,
    discount: {
        type: Number,
        default: 0
    },
    bgcolor: String,
    panelcolor: String,
    textcolor: {
        type: String,
        default: "#ffffff"
    }
});

module.exports = mongoose.model("product", productSchema);