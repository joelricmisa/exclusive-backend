require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const path = require("path");
const mongoose = require("mongoose");
const connectDB = require("./configs/connect-db");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const corsOptions = require("./configs/cors-options");
const credentials = require("./middlewares/credentials");
const handleError = require("./middlewares/error-handler-middleware");
const routes = require("./routes");

connectDB();
//middlewares
app.use(credentials);
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use("/", express.static(path.join(__dirname, "public")));

//routes
app.use("/", routes);

app.all("*", (req, res, next) => {
	const err = new Error("404 Not Found");
	err.status = 404;
	next(err);
});

//error handler
app.use(handleError);

mongoose.connection.once("open", () => {
	console.log("Connected to MongoDb");
	app.listen(port, () => {
		console.log(`Server is running at port ${port}`);
	});
});
