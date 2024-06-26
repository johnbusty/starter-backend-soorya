const express = require("express");
const morgan = require("morgan");
const tourRouter = require("./routes/tour.routes");
const userRouter = require("./routes/user.routes");
const AppError = require("./utils/AppError");
const globalErrorHandler = require("./controllers/error.controller");

const app = express();
console.log('\x1b[42mCurrent Environment:\x1b[0m',process.env.NODE_ENV);
if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}
app.use(express.json());
app.use(express.static("./public/img/pin.png"));

//custom middleware
// app.use((req, res, next) => {
// 	req.requestTime = new Date().toISOString();
// 	console.log(req.requestTime)
// 	next();
// });

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);


//!  ERROR HNDLING:
//handling unavailable routes
app.all("*", (req, res, next) => {
   
  next(new AppError(`Cannot find ${req.originalUrl} on this server!`, 404));
});


app.use(globalErrorHandler)
module.exports = app;