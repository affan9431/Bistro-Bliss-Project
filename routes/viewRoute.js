const express = require("express");
const viewController = require("./../controller/viewController");
const authController = require("./../controller/authController");
const router = express.Router();

router.route("/").get(authController.isLoggedIn, viewController.getHome);
router.route("/about").get(authController.isLoggedIn, viewController.getAbout);
router.route("/menu").get(authController.isLoggedIn, viewController.getMenu);
router.route("/cart").get(authController.isLoggedIn, viewController.getCart);
router.post(
  "/checkout-session",
  authController.protect, // Ensure the user is logged in
  viewController.getCheckoutSession
);
router
  .route("/order-detail")
  .get(authController.protect, viewController.getOrderDetail);
router
  .route("/booking")
  .get(authController.protect, viewController.getBookingTablePage);
router.route("/login").get(authController.isLoggedIn, viewController.loginPage);
router
  .route("/signup")
  .get(authController.isLoggedIn, viewController.signupPage);

router
  .route("/bookTable")
  .post(authController.protect, viewController.createBookingTable);

router
  .route("/menu-detail")
  .get(authController.isLoggedIn, viewController.getMenuById);

module.exports = router;
