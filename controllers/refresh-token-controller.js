const User = require("../models/User");
const jwt = require("jsonwebtoken");

const handleRefreshToken = async (req, res) => {
	try {
		const cookies = req.cookies;
		if (!cookies.jwt) return res.sendStatus(401);
		const refreshToken = cookies.jwt;

		jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, decoded) => {
			if (err) return res.sendStatus(403);

			const accessToken = jwt.sign(
				{
					userInfo: {
						name: decoded.user,
					},
				},
				process.env.ACCESS_TOKEN,
				{ expiresIn: "1d" }
			);

			res.status(200).json({
				message: "Displayed refresh token successfully",
				status: "ok",
				status_code: 200,
				accessToken,
			});
		});
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

module.exports = { handleRefreshToken };
