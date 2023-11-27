const User = require("../models/User");
const bcrypt = require("bcrypt");

const handleChangePassword = async (req, res) => {
	try {
		const { currentPassword, newPassword } = req.body;

		if (!currentPassword || !newPassword) return res.status(400).json({ message: "Please fill all the fields" });

		const user = await User.findById(req.id).exec();

		const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

		if (!isPasswordValid) {
			return res.status(401).json({ message: "Invalid current password" });
		}

		const hashedPassword = await bcrypt.hash(newPassword, 10);

		user.password = hashedPassword;
		await user.save();

		res.status(200).json({ message: "Password updated successfully", status: "ok", status_code: 200, user: user.name });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

module.exports = { handleChangePassword };
