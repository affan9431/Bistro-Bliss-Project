const Review = require("../model/reviewModel");
const AppError = require("../utils/AppError");

exports.createReview = async (req, res, next) => {
  try {
    const review = await Review.create(req.body);
    res.status(201).json({ status: "success", review: review });
  } catch (err) {
    next(new AppError(err, 500));
  }
};

exports.getAllReview = async (req, res, next) => {
  try {
    const reviews = await Review.find();
    res.status(200).json({ status: "success", reviews: reviews });
  } catch (err) {
    next(new AppError("Something went wrong", 500));
  }
};
