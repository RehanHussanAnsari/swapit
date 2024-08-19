const Listing = require("../models/listing");
const Review = require("../models/reviews");
const ExpressError = require("../utils/ExpressError"); // Ensure this is correctly imported

module.exports.createReview = async (req, res, next) => {
    try {
        // Find the listing by ID
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return next(new ExpressError(404, "Listing not found"));
        }

        // Create and save the new review
        const newReview = new Review(req.body.review);
        newReview.author = req.user._id; // Ensure req.user is set correctly

        // Save the review and update the listing
        await newReview.save();
        listing.review.push(newReview);
        await listing.save();

        req.flash("success", "Review added successfully!");
        res.redirect(`/listing/${listing._id}`);
    } catch (err) {
        return next(err);
    }
};

module.exports.deleteReview = async (req, res, next) => {
    try {
        const { id, reviewId } = req.params;

        // Find and delete the review
        const review = await Review.findById(reviewId);
        if (!review) {
            return next(new ExpressError(404, "Review not found"));
        }

        // Remove the review reference from the listing and delete the review
        await Listing.findByIdAndUpdate(id, { $pull: { review: reviewId } });
        await Review.findByIdAndDelete(reviewId);

        req.flash("error", "Review deleted successfully!");
        res.redirect(`/listing/${id}`);
    } catch (err) {
        return next(err);
    }
};
