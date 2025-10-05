const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authController");

// DEBUG: Check if User imports correctly
console.log("=== DEBUG USER IMPORT ===");
try {
    const User = require("../models/user-model");
    console.log("✅ User imported successfully");
    console.log("User model:", User);
} catch (err) {
    console.log("❌ User import failed:", err.message);
}
console.log("=== DEBUG END ===");

const User = require("../models/user-model");

// Add this debug middleware to check User in each request
router.use((req, res, next) => {
    console.log("🔍 User model in middleware:", User ? "DEFINED" : "UNDEFINED");
    next();
});

router.get("/", function(req, res) {
    res.send("hey it's working");
});

router.post("/register", registerUser);
router.post("/login", loginUser);

// LOGOUT ROUTE
router.get("/logout", function(req, res) {
    try {
        res.clearCookie("token");
        res.redirect("/");
    } catch (err) {
        res.status(500).send("Error during logout: " + err.message);
    }
});

// DEBUG ROUTE TO CHECK USERS
router.get("/debug/users", async function(req, res) {
    try {
        console.log("🔍 User model in debug route:", User ? "DEFINED" : "UNDEFINED");
        const users = await User.find();
        res.json({
            totalUsers: users.length,
            users: users.map(user => ({
                id: user._id,
                email: user.email,
                fullname: user.fullname
            }))
        });
    } catch (error) {
        res.json({ error: error.message });
    }
});


router.post("/cart/add", async function(req, res) {
    try {
        // Import inside the route as workaround
        const User = require("../models/user-model");
        
        console.log("Request body:", req.body);
        const { productId } = req.body;
        
        // First, get a real user from database
        const users = await User.find().limit(1);
        if (users.length === 0) {
            req.flash('error', 'No users found. Please register first.');
            return res.redirect("/shop");
        }
        
        const user = users[0];
        const userId = user._id;
        
        console.log("Using user:", user.email, "ID:", userId);

        // Initialize cart if it doesn't exist
        if (!user.cart) {
            user.cart = [];
        }

        // Check if product already in cart
        const existingItem = user.cart.find(item => 
            item.product && item.product.toString() === productId
        );
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            user.cart.push({
                product: productId,
                quantity: 1
            });
        }
        
        await user.save();
        console.log("Product added to cart successfully");
        
        // Use flash message
        req.flash('success', 'Product added to cart successfully!');
        res.redirect("/shop");
        
    } catch (err) {
        console.error("Error adding to cart:", err);
        req.flash('error', 'Error adding to cart');
        res.redirect("/shop");
    }
});

// CART PAGE ROUTE (keep this as is)
router.get("/cart", async function(req, res) {
    try {
        // TEMPORARY WORKAROUND: Import inside the route
        const User = require("../models/user-model");
        
        // Get first user from database
        const users = await User.find().limit(1);
        if (users.length === 0) {
            return res.redirect("/register");
        }
        
        const user = users[0];
        const populatedUser = await User.findById(user._id).populate('cart.product');
        
        // Filter out cart items with null products
        const validCartItems = populatedUser.cart.filter(item => item.product !== null);
        
        res.render("cart", { 
            cart: validCartItems || [],
            user: populatedUser
        });
    } catch (err) {
        console.error("Error loading cart:", err);
        res.status(500).send("Error loading cart");
    }
});

module.exports = router;