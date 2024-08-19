const mongoose = require("mongoose");
const Review = require("./reviews");

// Define the listing schema
const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        set: (i) => i === "" 
            ? "https://www.vrbo.com/vacation-ideas/wp-content/uploads/6fNK8c5bCT64DUKYQ4bFEM/2c28109fc4965be7e3645604761fd6be/1.boca-raton-3772178ha.jpg" 
            : i,
        default: "https://www.vrbo.com/vacation-ideas/wp-content/uploads/6fNK8c5bCT64DUKYQ4bFEM/2c28109fc4965be7e3645604761fd6be/1.boca-raton-3772178ha.jpg",
    },
    price: {
        type: Number,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    review: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
    }],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true, // Ensure that the owner field is required
    },
});

// Hook to delete associated reviews when a listing is deleted
listingSchema.post("findOneAndDelete", async function (listing) {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.review } });
    }
});

// Optional: Indexes for better performance on frequently queried fields
listingSchema.index({ title: 1 });
listingSchema.index({ location: 1 });
listingSchema.index({ country: 1 });
listingSchema.index({ owner: 1 });

// Create the model
const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
