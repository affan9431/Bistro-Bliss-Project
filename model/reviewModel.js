const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, // Title is required
    trim: true, // Trim any extra spaces
    minlength: 5, // Optional: Minimum length for the title
    maxlength: 100, // Optional: Maximum length for the title
  },
  description: {
    type: String,
    required: true, // Description is required
    minlength: 10, // Optional: Minimum length for the description
    maxlength: 1000, // Optional: Maximum length for the description
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "createdBy",
    select: "name email",
  });
  next();
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
