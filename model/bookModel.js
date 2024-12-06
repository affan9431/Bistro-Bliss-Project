const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    match: [/^\d{10}$/, "Phone number must be 10 digits long"],
  },
  date: {
    type: Date,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
    enum: [
      "5:00 PM",
      "5:30 PM",
      "6:00 PM",
      "6:30 PM",
      "7:00 PM",
      "7:30 PM",
      "8:00 PM",
      "8:30 PM",
      "9:00 PM",
    ],
  },
  endTime: {
    type: String,
    required: true,
    enum: [
      "5:30 PM",
      "6:00 PM",
      "6:30 PM",
      "7:00 PM",
      "7:30 PM",
      "8:00 PM",
      "8:30 PM",
      "9:00 PM",
      "9:30 PM",
      "10:00 PM",
      "10:30 PM",
      "11:00 PM",
    ],
    validate: {
      validator: function (value) {
        const startIndex = this.startTime
          ? [
              "5:00 PM",
              "5:30 PM",
              "6:00 PM",
              "6:30 PM",
              "7:00 PM",
              "7:30 PM",
              "8:00 PM",
              "8:30 PM",
              "9:00 PM",
            ].indexOf(this.startTime)
          : -1;
        const endIndex = [
          "5:30 PM",
          "6:00 PM",
          "6:30 PM",
          "7:00 PM",
          "7:30 PM",
          "8:00 PM",
          "8:30 PM",
          "9:00 PM",
          "9:30 PM",
          "10:00 PM",
          "10:30 PM",
          "11:00 PM",
        ].indexOf(value);
        return startIndex !== -1 && endIndex > startIndex;
      },
      message: "End time must be later than start time.",
    },
  },
  branch: {
    type: String,
    required: true,
    enum: ["sitapura", "jagatpura", "malviya nagar", "mansrover"],
  },
  persons: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },

  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

  isReserved: { type: Boolean, default: true },
});

bookingSchema.pre(/^find/, function (next) {
  this.populate({
    path: "createdBy",
    select: "name email",
  });
  next();
});

module.exports = mongoose.model("Booking", bookingSchema);
