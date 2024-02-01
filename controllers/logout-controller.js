const User = require("../models/User");
const errorHandler = require("../utils/error-handler");
const resSuccess = require("../utils/res-success");

const handleLogout = async (req, res) => {
	try {
		const cookies = req.cookies;
		if (!cookies.jwt)
			return res.status(204).json({
				status: "success",
				code: "204",
				message: "No Content",
				details: "Request successful, but no jwt cookie available",
			});

		const refreshToken = cookies.jwt;

		const user = await User.findOne({ refreshToken }).exec();

		if (!user) {
			res.clearCookie("jwt", { httpOnly: true, secure: true, sameSite: "None" });
			return res.status(204).json({
				status: "success",
				code: "204",
				message: "No Content",
				details: "Request successful, but no refresh token available",
			});
		}

		user.refreshToken = " ";
		user.save();

		res.clearCookie("jwt", { httpOnly: true, secure: true, sameSite: "None" });

		req.user = null;
		req.roles = null;
		req.id = null;

		resSuccess(res, 200, "Logout Successfully!", user.name);
	} catch (err) {
		errorHandler(req, res, err);
	}
};
module.exports = { handleLogout };
