var passportLocalMongoose   = require("passport-local-mongoose"),
    LocalStratedgy          = require("passport-local"),
    User                    = require("./models/user"),
    Campground              = require("./models/campground"),
    Comment                 = require("./models/comment"),
    methodOverride          = require("method-override"),
    flash                   = require("connect-flash"),
    bodyParser              = require("body-parser"),
    passport                = require("passport"),
    mongoose                = require("mongoose"),
    express                 = require("express"),
    seedDB                  = require("./seeds"),
    app                     = express()
    

// Requiring routes
var commentRoutes       = require("./routes/comments"),
    campgroundRoutes    = require("./routes/campgrounds"),
    indexRoutes         = require("./routes/index")

var url = process.env.DATABASE || "mongodb://localhost/yelp_camp_12";
mongoose.connect(url);
// mongoose.connect("mongodb://<USER>:<PASSWORD>@ds125288.mlab.com:25288/nissacjg-yelpcampv12");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.use(flash());
// seedDB();  //seed the database

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Muffin and Pudding FTW",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratedgy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Yelpcamp Server Started!");
});