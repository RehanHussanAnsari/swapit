const User = require("../models/user.js");  
module.exports.signUp = async(req,res)=>{
    try{
        let {username,email,password} = req.body;
        const newUser = new User({email,username});
        const registeredUser = await User.register(newUser,password);
        // console.log(registeredUser);
        req.login(registeredUser, (err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","User Registered Successfully");
            res.redirect("/listing");
        })
    }catch(e){
        req.flash("error","User Already Registered!");
        res.redirect("/signup");
    }
};

module.exports.login = (req,res)=>{
    res.render("users/login.ejs");
};

module.exports.checkSignup = async(req,res)=>{
    req.flash("success","Successfully Logged in!");
    let redirectUrl = res.locals.redirectUrl || "/listing";
    res.redirect(redirectUrl);
};

module.exports.logoutNow = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You are Logged Out!");
        res.redirect("/listing");
    })
};