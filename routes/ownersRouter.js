const express = require("express");
const router = express.Router();
const ownerModel = require("../models/owners-model");

if (process.env.NODE_ENV == "development") {
    router.post("/create", async function(req, res) {
        try {
            let owners = await ownerModel.find();
            if (owners.length > 0) {
                return res.status(403).send("You don't have permission to create a new owner");
            }
            
            let { fullname, email, password } = req.body;

            let createdOwner = await ownerModel.create({
                fullname,
                email,
                password,
            });
            res.status(201).send("Owner created successfully!");
        } catch (error) {
            res.status(500).send("Server error: " + error.message);
        }
    });
}

router.get("/", function(req, res) {
    res.send("hey it's working");
});

// FIXED: Remove flash usage until sessions are set up
router.get("/admin", function(req, res){
    // Remove flash line or replace with query parameters
    // let success = req.flash("success"); // ← COMMENT THIS OUT
    
    // Use query parameters instead
    const success = req.query.success;
    const error = req.query.error;
    
    res.render("createproducts", { 
        success: success,
        error: error 
    });
});

module.exports = router;