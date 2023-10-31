const User = require("../models/User");
const bcrypt = require("bcrypt");

const getAllUsers = async (req, res) => {
	try {
		const users = await User.find();
		if (!users) return res.sendStatus(204);
		res.status(200).json({ data: users });
	} catch (err) {
		res.status(500).json({ err: err.message });
	}
};

const getUserById = async (req, res) => {
	try {
		const userId = req.params.id;
		if (!userId) return res.status(400).json({ message: "User id is required!" });
		const user = await User.findOne({ _id: userId }).exec();
		if (!user) return res.sendStatus(204);
		res.status(200).json({ data: user });
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
};

const handleNewUser = async (req, res) => {
	try {
		const { name, email, password, roles } = req.body;
		if (!name || !email || !password) return res.status(400).json({ message: "Please fill up all inputs." });
		const duplicate = await User.findOne({ email }).exec();
		if (duplicate) return res.status(409).json({ message: "This email is already used!" });

		const hashedPwd = await bcrypt.hash(password, 10);

		const user = await User.create({
			name,
			email,
			password: hashedPwd,
			roles: JSON.parse(roles),
		});

		res.status(201).json({ message: `User ${name} is created!`, data: user });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const updateUserById = async (req, res) => {
	try {
		const userId = req.params.id;
		const { name, email, roles } = req.body;
		if (!userId) return res.status(400).json({ message: "User id is required" });
		const user = await User.findOne({ _id: userId }).exec();
		if (!user) return res.status(404).json({ message: "This user is not found" });

		if (!name || !email || !roles) return res.status(400).json("Please fill up all inputs");
		if (name) user.name = name;
		if (email) user.email = email;
		if (roles) user.roles = { ...JSON.parse(roles) };

		const result = await user.save();

		res.status(200).json({ message: "User is updated", data: result });
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
};

const deleteUserById = async (req, res) => {
	try {
		const userId = req.params.id;
		if (!userId) return res.status(400).json({ message: "User id is required" });

		const user = await User.findOne({ _id: userId }).exec();
		if (!user) return res.status(404).json({ message: "User is not found" });

		const result = await user.deleteOne();
		res.status(200).json({ message: "User is deleted", data: result });
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
};

module.exports = { getAllUsers, getUserById, handleNewUser, updateUserById, deleteUserById };
