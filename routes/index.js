var express     = require("express");
var router      = express.Router();
var User        = require("../models/user");
var passport    = require("passport");

// ROOT ROUTE
router.get("/",function(req, res) {
    res.render("home");
});

// Show register form
router.get("/register", function(req,res){
    if(req.user){
        req.flash("error", "You are already logged in, please log out first");
        return res.redirect("back");
    }
    res.render("register", {page: "register"});
});

// Handling user sign up
router.post("/register", function(req, res){
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
      if(err){
          req.flash("error", err.message);
          return res.redirect("register");
      } 
      passport.authenticate("local")(req, res, function(){
          req.flash("success", "Successfully Signed Up! Welcome to YelpCamp " + user.username);
          res.redirect("/campgrounds");
      });
    });
});

// Show Login Page  
router.get("/login", function(req, res) {
    res.render("login", {page: "login"});
});

// Handling user login
// including middleware (passport.authenticate)
router.post("/login", passport.authenticate("local", {
    successFlash: "Welcome back!",
    successRedirect: "/campgrounds",
    failureFlash: "Username or Password is incorrect",
    failureRedirect: "/login"
    }), function(req, res){
});

// Handling user logout
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "See you next time!")
    res.redirect("/campgrounds");
});

module.exports = router;