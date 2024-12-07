const Food = require("../model/FoodModel");
const AppError = require("../utils/AppError");

exports.createFoodBooking = async (req, res, next) => {
  try {
    const food = await Food.create(req.body);
    res.status(201).json({
      status: "success",
      data: food,
      message: "Food booking created successfully",
    });
  } catch (err) {
    next(new AppError("Error in creating Food Booking", 500));
  }
};
exports.getAllFoodBookingData = async (req, res, next) => {
  try {
    const food = await Food.find();
    res.status(201).json({
      status: "success",
      data: food,
      message: "Food booking created successfully",
    });
  } catch (err) {
    next(new AppError("Error in getting Food Booking data", 500));
  }
};
