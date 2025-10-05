const express = require("express");
const isLoggedIn = require("../middlewares/isLoggedIn");
const productModel = require("../models/product-model");
const userModel = require("../models/user-model");
const router = express.Router();

router.get("/", function(req, res){
    res.render("index");
});

router.get("/shop", async function(req, res){
    try {
        console.log("🛍️ Fetching products for shop...");
        let products = await productModel.find();
        console.log(`✅ Found ${products.length} products`);
        
        // Get message from query parameters
        const message = req.query.message;
        
        res.render("shop", { 
            products: products || [],
            message: message // Pass message to EJS
        });
    } catch (error) {
        console.error("❌ Error in /shop route:", error);
        res.render("shop", { 
            products: [],
            message: null
        });
    }
});

router.get("/addtocard/:id",isLoggedIn,async function(req,res){
    user.cart.push(req.params.productid);
    await user.save();
    req.flash("success","added to cart");
    res.redirect("/shop");

})
module.exports = router;