const User = require("../models/User");
const bcrypt = require("bcrypt");
const errorHandler = require("../utils/error-handler");
const resErr = require("../utils/res-error");
const resSuccess = require("../utils/res-success");

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

		resSuccess(res, 201, `User ${name} is created!`, result);
	} catch (err) {
		errorHandler(req, res, err);
	}
};

module.exports = { handleNewUser };
