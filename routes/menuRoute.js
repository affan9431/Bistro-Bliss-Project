const express = require("express");
const menuController = require("./../controller/menuController");


const router = express.Router();

router
  .route("/")
  .get(menuController.getAllMenu)
  .post(menuController.createMenu);

router.route("/:id").get(menuController.getMenuById);

module.exports = router;
