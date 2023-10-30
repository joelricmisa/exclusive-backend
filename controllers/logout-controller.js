const User = require("../models/User");

const handleLogout = async (req, res) => {
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
	res.status(200).json({ user: user.name, message: "Logout Success!" });
};
module.exports = { handleLogout };
