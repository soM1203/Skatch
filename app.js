const express = require('express');
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require('express-session');
const flash = require('connect-flash');
const ownersRouter = require("./routes/ownersRouter");
const productsRouter = require("./routes/productsRouter");
const usersRouter = require("./routes/usersRouter");
const indexRouter = require("./routes/index");

require("dotenv").config();

const db = require("./config/mongoose-connection");

const app = express();

// ✅ SESSION MIDDLEWARE - MUST BE FIRST
app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback-secret-key-12345',
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: false,
        maxAge: 1000 * 60 * 60 * 24
    }
}));

// ✅ FLASH MIDDLEWARE - AFTER SESSION
app.use(flash());

// ✅ Make flash messages available to all views
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success');
    res.locals.error_msg = req.flash('error');
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

// ✅ ROUTES - AFTER ALL MIDDLEWARE
app.use("/owners", ownersRouter);
app.use("/users", usersRouter);
app.use("/products", productsRouter);
app.use("/", indexRouter); // This handles both / and /shop

app.listen(3000, () => {
    console.log("Server running on port 3000");
    console.log("Session middleware is configured");
});