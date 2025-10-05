const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/generateToken");

module.exports.registerUser = async function (req, res) {
    try {
        let { email, password, fullname } = req.body;
        
        // Check if user already exists
        let user = await userModel.findOne({ email: email });
        if (user) return res.status(401).send("You already have an account");
        
        // Hash password and create user
        const hashedPassword = await bcrypt.hash(password, 10);
        
        let newUser = await userModel.create({
            email,
            password: hashedPassword,
            fullname,
        });
        
        let token = generateToken(newUser);
        res.cookie("token", token);
        
        res.status(201).json({
            message: "User created successfully!",
            user: {
                id: newUser._id,
                email: newUser.email,
                fullname: newUser.fullname
            }
        });
        
    } catch (err) {
        res.status(500).send("Error: " + err.message);
    }
};

module.exports.loginUser = async function (req, res) {
    try {
        let { email, password } = req.body;
        let user = await userModel.findOne({ email: email });
        
        if (!user) return res.status(401).send("Email or password incorrect");
        
        bcrypt.compare(password, user.password, function(err, result) {
            if (err) {
                return res.status(500).send("Error comparing passwords: " + err.message);
            }
            
            if (result) {
                let token = generateToken(user);
                res.cookie("token", token);
                
                // Redirect to shop page instead of sending JSON
                res.redirect("/shop");
            } else {
                res.status(401).send("Email or password incorrect");
            }
        });
        
    } catch (err) {
        res.status(500).send("Error: " + err.message);
    }
};

// In usersController.js
