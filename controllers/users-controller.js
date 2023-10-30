const User = require("../models/User");
const bcrypt = require("bcrypt");

const getAllUsers = async (req, res) => {
	const users = await User.find();
	if (!users) return res.sendStatus(204);
	res.status(200).json({ data: users });
};

const getUserById = async (req, res) => {
	const userId = req.params.id;
	if (!userId) return res.status(400).json({ message: "User id is required!" });
	const user = await User.findOne({ _id: userId }).exec();
	if (!user) return res.sendStatus(204);
	res.status(200).json({ data: user });
};

const handleNewUser = async (req, res) => {
	const { name, email, password, roles } = req.body;
	if (!name || !email || !password) return res.status(400).json({ message: "Please fill up all inputs." });

	const duplicate = await User.findOne({ email }).exec();
	if (duplicate) return res.status(409).json({ message: "This email is already used!" });

	const hashedPwd = await bcrypt.hash(password, 10);

	const user = await User.create({
		name,
		email,
		password: hashedPwd,
		roles,
	});

	res.status(201).json({ message: `User ${name} is created!`, data: user });
};

const updateUserById = async (req, res) => {
	const userId = req.params.id;
	const { name, email, role } = req.body;
	if (!userId) return res.status(400).json({ message: "User id is required" });
	const user = await User.findOne({ _id: userId }).exec();
	if (!user) return res.status(404).json({ message: "This user is not found" });

	if (!name || !email || role) return res.status(400).json("Please fill up all inputs");
	if (name) user.name = name;
	if (email) user.email = email;
	if (role) user.roles = role;

	const result = await user.save();

	res.status(200).json({ message: "User is updated", data: result });
};

const deleteUserById = async (req, res) => {
	const userId = req.params.id;
	if (!userId) return res.status(400).json({ message: "User id is required" });

	const user = await User.findOne({ _id: userId }).exec();
	if (!user) return res.status(404).json({ message: "User is not found" });

	const result = await user.deleteOne();
	res.status(200).json({ message: "User is deleted", data: result });
};

module.exports = { getAllUsers, getUserById, handleNewUser, updateUserById, deleteUserById };
