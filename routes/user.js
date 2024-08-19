const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");

const userController = require("../controller/user.js");

router.route("/signup")
.get((req,res)=>{
    res.render("users/signup.ejs");
})
.post(wrapAsync(userController.signUp)
);

router.route("/login")
.get(userController.login)
.post(saveRedirectUrl, passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), userController.checkSignup);

router.get("/logout",userController.logoutNow);

passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

module.exports = router;