var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware")

// INDEX - show all campgrounds
router.get("/", function(req, res){
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else{
            res.render("campgrounds/index", {campgrounds:allCampgrounds, page: "campgrounds"});
        }
    })
});

// Show new campground form
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

// Add new campground to DB - CREATE
router.post("/", middleware.isLoggedIn, function(req,res){
    var author = { id: req.user._id, username: req.user.username};
    var newCamp = { name: req.body.name, image: req.body.image, description: req.body.description, author: author, price: req.body.price};
    // Create a new campground and save to DB
    Campground.create(newCamp, function(err, newlyCreated){
        if(err){
            req.flash("error", "Something went wrong");
            console.log(err);
        } else {
            // redrirect back to campgrounds
            req.flash("success", "Successfully added Campground")
            res.redirect("/campgrounds");
        }
    })
});

// SHOW - shows more info about one campground
router.get("/:id", function(req, res){
    // find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error", "Campground not found");
            res.redirect("/campgrounds")
            console.log(err);
        } else {
            // render the show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    })
});

// EDIT
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

// UPDATE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Campground updated");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DESTROY
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    // destroy blog
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Campground deleted");
            // redirect somehwere
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;