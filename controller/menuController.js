const Menu = require("./../model/menuModel");
const mongoose = require("mongoose");
const AppError = require("./../utils/appError");

exports.createMenu = async (req, res) => {
  try {
    const data = req.body;
    const menu = await Menu.create(data);
    res.status(201).json({
      status: "success",
      data: menu,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.getAllMenu = async (req, res) => {
  const menus = await Menu.find();
  res.status(200).json({
    status: "success",
    results: menus.length,
    data: menus,
  });
};

exports.getMenuById = async (req, res, next) => {
  try {
    // Validate the ID format before querying
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(new AppError("Invalid menu ID", 400));
    }

    const menu = await Menu.findById(req.params.id);
    if (!menu) {
      return next(new AppError("Menu not found", 404));
    }
    res.status(200).json({
      status: "success",
      data: menu,
    });
  } catch (err) {
    return next(new AppError(err.message, 500));
  }
};
