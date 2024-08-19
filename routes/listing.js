const express = require("express");
const router = express.Router({ mergeParams: true });
const { listingSchema } = require("../schema.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const { isLoggedIn } = require("../middleware.js");
const listingController = require("../controller/listing.js");

// Middleware to validate listing data
const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map(el => el.message).join(', ');
        return next(new ExpressError(400, errMsg));
    }
    next();
};
router.get("/new", isLoggedIn, listingController.renderNewForm);

// Route to list all listings and create a new listing
router.route("/")
    .get(wrapAsync(listingController.index)) // List all listings
    .post(isLoggedIn, validateListing, wrapAsync(listingController.newListing)); // Create new listing

// Route to show form for new listing

router.route("/:id")
.get(wrapAsync(listingController.showListings))
.put(isLoggedIn, validateListing, wrapAsync(listingController.updateListing));



// Route to show form for editing a listing
router.get("/:id/edit", isLoggedIn, wrapAsync(listingController.editPage));

// Route to delete a listing
router.delete("/:id", isLoggedIn, wrapAsync(listingController.deleteListing));

module.exports = router;
