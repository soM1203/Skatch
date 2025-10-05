const express = require("express");
const router = express.Router();
const upload = require("../config/multer-config");
const Product = require("../models/product-model");

// GET route to display the form
router.get("/create", function(req, res) {
    res.render("createproducts", {
        message: req.query.message ? {
            text: req.query.message,
            type: req.query.type || 'success'
        } : null
    });
});

// POST route to handle form submission
router.post("/create", upload.single("image"), async function(req, res) {
    try {
        let { name, price, bgcolor, panalcolor } = req.body; // Now matches schema
        
        // Check if file was uploaded
        if (!req.file) {
            return res.redirect('/products/create?message=Please upload an image&type=error');
        }

        let product = await Product.create({
            image: req.file.buffer,
            imageType: req.file.mimetype,
            name: name,                    // Matches schema
            price: parseFloat(price),      // Matches schema
            discount: 0,
            bgcolor: bgcolor,              // Matches schema
            panalcolor: panalcolor,        // Matches schema
            textcolor: "#ffffff"
        });

        console.log("Product saved:", product);
        
        res.redirect('/products/create?message=Product created successfully!&type=success');
    } catch (err) {
        console.error("Error creating product:", err);
        res.redirect('/products/create?message=Error creating product: ' + err.message + '&type=error');
    }
});

// Debug route to check products
router.get("/debug", async function(req, res) {
    try {
        const products = await Product.find();
        res.json({
            totalProducts: products.length,
            products: products
        });
    } catch (error) {
        res.json({ error: error.message });
    }
});

module.exports = router; // ONLY ONCE