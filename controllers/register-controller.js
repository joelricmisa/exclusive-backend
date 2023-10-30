const User = require("../models/User");
const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
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

	res.status(201).json({ message: `User ${name} is created!`, data: result });
};

module.exports = { handleNewUser };