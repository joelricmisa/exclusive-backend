const User = require("../models/User");
const bcrypt = require("bcrypt");
const errorHandler = require("../utils/error-handler");
const resErr = require("../utils/res-error");

const handleNewUser = async (req, res) => {
	try {
		const { name, email, password } = req.body;
		if (!name || !email || !password) return resErr(res, 400, "Name, Email, and Password are required!");

		const duplicate = await User.findOne({ email }).exec();

		if (duplicate) return resErr(res, 409, "This email is already used!");

		const hashedPwd = await bcrypt.hash(password, 10);

		const result = await User.create({
			name,
			email,
			password: hashedPwd,
		});

		result.password = "Encrypted";

		res.status(201).json({
			message: `User ${name} is created!`,
			status: "created",
			status_code: 201,
			data: result,
		});
	} catch (err) {
		errorHandler(req, err);
	}
};

module.exports = { handleNewUser };
