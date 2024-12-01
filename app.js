const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const app = express();
const cookieParser = require("cookie-parser");
const Menu = require("./model/menuModel");
const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const menuRouter = require("./routes/menuRoute");
const viewRouter = require("./routes/viewRoute");
const bookingRouter = require("./routes/bookingRoute");
const userRouter = require("./routes/userRoute");
const AppError = require("./utils/AppError");
const globalError = require("./controller/errorController");

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.use(cookieParser());

const mongoURI = process.env.DATABASE_URL;

if (!mongoURI) {
  console.error("MONGODB_URI environment variable is missing");
  process.exit(1);
}

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api/menu", menuRouter);
app.use("/", viewRouter);
app.use("/users", userRouter);
app.use("/api/booking", bookingRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on the server`, 404));
});

app.use(globalError);

const PORT = 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
