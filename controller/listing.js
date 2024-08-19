const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    const listings = await Listing.find();
    res.render("listings/index.ejs", { listings });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};
module.exports.showListings = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({ path: "review", populate: { path: "author" } })
        .populate("owner");
    if (!listing) {
        return next(new ExpressError(404, "Listing not found"));
    }
    res.render("listings/show.ejs", { listing, myUsr: req.user }); // Passing `myUsr` for owner check in the view
};

module.exports.newListing = async (req, res) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;    
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect(`/listing/${newListing._id}`);
};

module.exports.editPage = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        return next(new ExpressError(404, "Listing not found"));
    }
    // Check if the current user is the owner of the listing
    if (!listing.owner.equals(req.user._id)) {
        req.flash("error", "You are not authorized to edit this listing.");
        return res.redirect(`/listing/${id}`);
    }
    res.render("listings/edit.ejs", { listing });
};

module.exports.updateListing = async (req, res, next) => {
    const { id } = req.params;
    const updatedListing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });
    if (!updatedListing) {
        return next(new ExpressError(404, "Listing not found"));
    }
    req.flash("success", "Listing updated!");
    res.redirect(`/listing/${id}`);
};

module.exports.deleteListing = async (req, res, next) => {
    const { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    if (!deletedListing) {
        return next(new ExpressError(404, "Listing not found"));
    }
    req.flash("error", "Listing Deleted Successfully!");
    res.redirect("/listing");
};