const User = require("../models/User");
const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
	try {
		const { name, email, password } = req.body;
		if (!name || !email || !password) return res.status(400).json({ message: "Name, Email, and Password are required!" });

		const duplicate = await User.findOne({ email }).exec();

		if (duplicate) return res.status(409).json({ message: "This email is already used!" });

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
		res.status(500).json({ error: err.message });
	}
};

module.exports = { handleNewUser };
