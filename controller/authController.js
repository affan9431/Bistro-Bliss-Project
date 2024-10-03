const jwt = require("jsonwebtoken");
const User = require("./../model/userModel");
const { promisify } = require("util");
const Email = require("../public/js/email");
const AppError = require("../utils/AppError");

exports.signup = async (req, res) => {
  const newUser = await User.create(req.body);

  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });

  const url = `${req.protocol}://${req.get("host")}`;

  await new Email(newUser, url).sendWelcome();

  res.status(201).json({
    status: "success",
    data: {
      token: token,
      user: newUser,
    },
  });
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password.", 404));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassoword(password, user.password))) {
    return next(new AppError("Invalid credentials.", 404));
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });

  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      token: token,
    },
  });
};

exports.logout = (req, res) => {
  res.cookie("jwt", "logout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};

exports.protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError("You are not logged in. Please log in to get access.", 401)
    );
  }

  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET_KEY
  );

  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(
      new AppError("The user belonging to this token no longer exists.", 401)
    );
  }

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password. Please log in again.", 401)
    );
  }

  req.user = currentUser;
  res.locals.user = currentUser;

  next();
};

exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET_KEY
      );

      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};
