require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const path = require("path");
const mongoose = require("mongoose");
const connectDB = require("./configs/connect-db");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const verifyJWT = require("./middlewares/verify-jwt");

connectDB();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use("/", express.static(path.join(__dirname, "public")));

app.use("/", require("./routes/root"));
app.use("/api/register", require("./routes/register"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/refresh", require("./routes/refresh-token"));
app.use("/api/logout", require("./routes/logout"));

app.use(verifyJWT);
app.use("/api/users", require("./routes/api/users"));
app.use("/api/products", require("./routes/api/products"));

mongoose.connection.once("open", () => {
	console.log("Connected to MongoDb");
	app.listen(port, () => {
		console.log(`Server is running at port ${port}`);
	});
});
