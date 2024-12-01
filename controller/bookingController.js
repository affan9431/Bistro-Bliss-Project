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
