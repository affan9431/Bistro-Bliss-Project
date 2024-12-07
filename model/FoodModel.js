const mongoose = require("mongoose");

const FoodSchema = new mongoose.Schema({
  cartItems: {
    type: Array,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  address: {
    type: Array,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Food = mongoose.model("Food", FoodSchema);

module.exports = Food;
