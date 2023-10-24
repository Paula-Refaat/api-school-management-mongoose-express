const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
dotenv.config({ path: "config.env" });

const dbConnection = require("./config/database");
const ApiError = require("./utils/ApiError");
const globalError = require("./middlewares/errorMiddleware");

const authRoute = require("./routes/authRoute");
const schoolRoute = require("./routes/schoolRoute");
const classRoomRoute = require("./routes/classRoomRoute");
const studentRoute = require("./routes/studentRoute");


dbConnection();

const app = express();

app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

app.get("/", (req, res) => {
  res.send("App Running ...");
});

//Mount Routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/schools", schoolRoute);
app.use("/api/v1/classrooms", classRoomRoute);
app.use("/api/v1/students", studentRoute);


// Handel unhandelling Routes
app.all("*", (req, res, next) => {
  next(new ApiError(`Can't found this Route : ${req.originalUrl}`, 400));
});

// Global error handelling middleware
app.use(globalError);

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`App Running on port ${PORT}`);
});

process.on("unhandledRejection", (error) => {
  console.log(`unhandledRejection Error : ${error.name} | ${error.message}`);
  server.close(() => {
    console.error("Shutting down.... ");
    process.exit(1);
  });
});
