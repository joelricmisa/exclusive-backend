const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const errorHandler = require("../utils/error-handler");
const resErr = require("../utils/res-error");
const resSuccess = require("../utils/res-success");

const handleLogin = async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) return resErr(res, 400, "Email and Password are required");

		const user = await User.findOne({ email }).exec();
		if (!user) return resErr(res, 401, "Invalid Credentials");

		const match = await bcrypt.compare(password, user.password);

		if (match) {
			const role = Object.values(user.roles).filter(Boolean);

			const accessToken = jwt.sign(
				{
					userInfo: {
						name: user.name,
						role,
						id: user._id,
					},
				},
				process.env.ACCESS_TOKEN,
				{ expiresIn: "1h" }
			);

			const refreshToken = jwt.sign(
				{
					user: user.name,
					role,
					id: user._id,
				},
				process.env.REFRESH_TOKEN,
				{
					expiresIn: "1d",
				}
			);

			user.refreshToken = refreshToken;
			user.save();

			res.cookie("jwt", refreshToken, { httpOnly: true, secure: true, sameSite: "None", maxAge: 24 * 60 * 60 * 1000 });
			resSuccess(res, 200, "Authenticated", { user: user.email, accessToken, role });
		} else {
			return resErr(res, 401, "Invalid Credentials, please make sure you have a valid email and a correct password for your account!");
		}
	} catch (err) {
		errorHandler(req, err);
	}
};

module.exports = { handleLogin };
