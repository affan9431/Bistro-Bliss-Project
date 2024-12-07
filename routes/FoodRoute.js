const express = require("express");
const FoodController = require("./../controller/FoodController");

const router = express.Router();

router
  .route("/")
  .get(FoodController.getAllFoodBookingData)
  .post(FoodController.createFoodBooking);

module.exports = router;

