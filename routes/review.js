const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/reviews.js");
const { reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const { isLoggedIn } = require("../middleware.js");

// Middleware to validate review input
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        // Join error messages into a single string
        const errMsg = error.details.map(el => el.message).join(', ');
        return next(new ExpressError(400, errMsg));
    }
    next();
};

const reviewController = require("../controller/review.js");

// Route to add a review
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

// Route to delete a review
router.delete("/:reviewId", isLoggedIn, wrapAsync(reviewController.deleteReview));

module.exports = router;
