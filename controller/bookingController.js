const Booking = require("./../model/bookModel");
const AppError = require("./../utils/AppError");

exports.createBooking = async (req, res, next) => {
  try {
    const booking = await Booking.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        booking,
      },
    });
  } catch (err) {
    next(new AppError(err.message, 400));
  }
};

exports.getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find();

    res.status(200).json({
      status: "success",
      results: bookings.length,
      data: {
        bookings,
      },
    });
  } catch (err) {
    next(new AppError(err.message, 400));
  }
};


// exports.deleteOne = async (req, res, next) => {
//   try {
//     const { phone } = req.body; // Get phone from request body

//     // Find the booking by phone
//     const booking = await Booking.findOne({ phone });

//     if (!booking) {
//       return res
//         .status(404)
//         .json({ message: "Booking not found for the provided phone number" });
//     }

//     const currentTime = moment(); // Get current time
//     const startTime = moment(booking.startTime, "h:mm A");
//     const endTime = moment(booking.endTime, "h:mm A");

//     // Check if current time lies between startTime and endTime
//     if (currentTime.isBetween(startTime, endTime)) {
//       // Update the isReserved field to false
//       booking.isReserved = false;
//       await booking.save(); // Save the changes to the database

//       return res
//         .status(200)
//         .json({ message: "Booking updated successfully", booking });
//     } else {
//       return res
//         .status(400)
//         .json({ message: "Current time is not within the booking time range" });
//     }
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// };
