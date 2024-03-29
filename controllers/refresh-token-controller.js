const User = require("../models/User");
const jwt = require("jsonwebtoken");
const errorHandler = require("../utils/error-handler");
const resErr = require("../utils/res-error");
const resSuccess = require("../utils/res-success");

const handleRefreshToken = async (req, res) => {
	try {
		const cookies = req.cookies;
		if (!cookies.jwt) return resErr(res, 401, "Invalid credentials");
		const refreshToken = cookies.jwt;

		const user = await User.findOne({ refreshToken }).exec();
		if (!user) return resErr(res, 403, "You don't have access to this path");

		jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, decoded) => {
			if (err) return res.sendStatus(403);

			const accessToken = jwt.sign(
				{
					userInfo: {
						name: decoded.user,
						role: decoded.role,
						id: decoded.id,
					},
				},
				process.env.ACCESS_TOKEN,
				{ expiresIn: "1h" }
			);

			resSuccess(res, 200, "Displayed refresh token successfully", {
				accessToken,
				user: user.email,
				role: user.roles,
			});
		});
	} catch (err) {
		errorHandler(req, res, err);
	}
};

module.exports = { handleRefreshToken };
