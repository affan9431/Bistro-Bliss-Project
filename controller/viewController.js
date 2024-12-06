const Menu = require("./../model/menuModel");
const Booking = require("./../model/bookModel");
const mongoose = require("mongoose");
const AppError = require("./../utils/AppError");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.getHome = (req, res) => {
  res.render("Home");
};

exports.getAbout = (req, res) => {
  res.render("About");
};

exports.getMenu = async (req, res) => {
  try {
    const menus = await Menu.find();

    res.render("Menu", {
      menus,
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.createBookingTable = (req, res) => {
  res.status(200).json({
    status: "success",
    data: "Not Implemented",
  });
};

exports.getBookingTablePage = (req, res) => {
  res.status(200).render("BookTable");
};

exports.loginPage = (req, res) => {
  res.status(200).render("Login");
};
exports.signupPage = (req, res) => {
  res.status(200).render("SignUp");
};

exports.getCart = (req, res) => {
  res.status(200).render("Cart");
};

exports.getCheckoutSession = async (req, res, next) => {
  const items = req.body.items;

  // Create line items for Stripe checkout session
  const lineItems = items.map((item) => {
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          images: [item.image], // Use item image from cart
        },
        unit_amount: parseFloat(item.price.replace("$", "")) * 100, // Convert price to cents
      },
      quantity: item.quantity, // Quantity of the item ordered
    };
  });

  // Create Stripe checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    success_url: `${req.protocol}://${req.get("host")}/order-detail`,
    cancel_url: `${req.protocol}://${req.get("host")}/menu`,
    customer_email: req.user.email, // Assuming you're storing the logged-in user's email
    mode: "payment",
    line_items: lineItems,
  });

  // Send the session ID back to the frontend
  res.status(200).json({
    status: "success",
    session,
  });
};

exports.getOrderDetail = (req, res) => {
  res.status(200).render("OrderDetail");
};
exports.getShowTableBookingPage = async (req, res) => {
  const booking = await Booking.find();
  res.status(200).render("showBooking", {
    booking,
  });
};

exports.getMenuById = async (req, res, next) => {
  res.status(200).render("MenuDetail");
};
