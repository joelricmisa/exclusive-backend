const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleLogin = async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) return res.status(400).json({ message: "Email and Password are required" });

		const user = await User.findOne({ email }).exec();
		if (!user) return res.status(401).json({ message: "Invalid Credentials" });

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

			res.status(200).json({
				message: "Authenticated",
				user: user.email,
				status: "ok",
				status_code: 200,
				accessToken,
				role,
			});
		} else {
			res.status(401).json({
				message: "Invalid Credentials, please make sure you have a valid email and a correct password for your account!",
			});
		}
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

module.exports = { handleLogin };
