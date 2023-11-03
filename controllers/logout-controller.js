const User = require("../models/User");

const handleLogout = async (req, res) => {
	try {
		const cookies = req.cookies;
		if (!cookies.jwt) return res.sendStatus(204);

		const refreshToken = cookies.jwt;

		const user = await User.findOne({ refreshToken }).exec();
		if (!user) {
			res.clearCookie("jwt", { httpOnly: true, secure: true, sameSite: "None" });
			return res.status(204).json({ message: "No Content" });
		}

		user.refreshToken = " ";
		user.save();

		res.clearCookie("jwt", { httpOnly: true, secure: true, sameSite: "None" });
		res.status(200).json({
			message: "Logout Successfully!",
			status: "ok",
			status_code: 200,
			user: user.name,
		});
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};
module.exports = { handleLogout };
