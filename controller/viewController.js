const Menu = require("./../model/menuModel");
const Booking = require("./../model/bookModel");
const Food = require("./../model/FoodModel");
const mongoose = require("mongoose");
const Email = require("../public/js/email");
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

  const url = `${req.protocol}://${req.get("host")}`;
  const user = { email: req.user.email, name: req.user.name }; // Provide user details
  await new Email(user, url).sendOrderConfirmed();

  // Send the session ID back to the frontend
  res.status(200).json({
    status: "success",
    session,
  });
};

exports.getCheckoutSession1 = async (req, res, next) => {
  const tableData = req.body.items; // Get tableData from the request body
  console.log(tableData);

  // Create custom line items or use metadata to pass the booking information
  const lineItems = [
    {
      price_data: {
        currency: "usd",
        product_data: {
          name: `Table Booking at ${tableData.branch}`, // Custom product name
          description: `Booking for ${tableData.persons} persons on ${tableData.date} from ${tableData.startTime} to ${tableData.endTime}`,
        },
        unit_amount: 5000, // Use a fixed amount for the booking, or calculate it based on your logic
      },
      quantity: 1, // Single booking
    },
  ];

  try {
    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      success_url: `${req.protocol}://${req.get("host")}/showTableBooking`,
      cancel_url: `${req.protocol}://${req.get("host")}/menu`,
      customer_email: req.user.email,
      mode: "payment",
      line_items: lineItems,
      metadata: {
        date: tableData.date,
        startTime: tableData.startTime,
        endTime: tableData.endTime,
        branch: tableData.branch,
        name: tableData.name,
        phone: tableData.phone,
        persons: tableData.persons,
        createdBy: tableData.createdBy,
      },
    });

    const url = `${req.protocol}://${req.get("host")}`;
    const user = { email: req.user.email, name: req.user.name }; // Provide user details
    await new Email(user, url).sendOrderConfirmed(); // Send email notification

    // Send the session URL back to frontend for redirect
    res.status(200).json({
      status: "success",
      session: {
        url: session.url,
      },
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to create checkout session",
    });
  }
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

exports.getUser = async (req, res, next) => {
  res.status(200).render("userPage");
};

exports.getAdmin = async (req, res, next) => {
  const tableBookings = await Booking.find();
  const FoodBookings = await Food.find();

  res.status(200).render("admin", {
    tableBookings,
    FoodBookings,
  });
};
