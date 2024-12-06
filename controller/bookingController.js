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
