const User = require("../models/User");
const bcrypt = require("bcrypt");
const Product = require("../models/Product");
const mongoose = require("mongoose");

const getAllUsers = async (req, res) => {
	try {
		const users = await User.find({}, "-password -__v").exec();
		if (!users) return res.sendStatus(204);

		res.status(200).json({
			message: "Users displayed successfully",
			status: "ok",
			status_code: 200,
			usersCount: users.length,
			data: users,
		});
	} catch (err) {
		res.status(500).json({ err: err.message });
	}
};

const getUserById = async (req, res) => {
	try {
		const userId = req.params.id;
		if (!userId) return res.status(400).json({ message: "User id is required!" });

		const user = await User.findById(userId, "-password -__v").populate("cart").exec();
		if (!user) return res.sendStatus(404);

		res.status(200).json({
			message: "User displayed successfully",
			status: "ok",
			status_code: 200,
			data: user,
		});
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
};

const getCurrentUser = async (req, res) => {
	try {
		const id = req.id;
		if (!id) return res.sendStatus(401);

		const user = await User.findById(id, "-password -__v").exec();
		if (!user) return res.sendStatus(401);

		res.status(200).json({
			message: "Get current user successfully",
			status: "ok",
			status_code: 200,
			data: user,
		});
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

		user.password = "Encrypted";

		res.status(201).json({
			message: `User ${name} is created!`,
			status: "created",
			status_code: 201,
			data: user,
		});
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const updateUserById = async (req, res) => {
	try {
		const { name, email, cartIds, wishlistIds } = req.body;
		const userId = req.params.id;

		if (!userId) return res.status(400).json({ message: "User id is required" });

		const user = await User.findById(userId).exec();

		if (!user) return res.status(404).json({ message: "This user is not found" });

		if (!name || !email) return res.status(400).json({ message: "Please fill up all inputs" });

		if (cartIds) {
			// console.log("cartIds", cartIds);

			const validObjectCartIds = cartIds.map((id) => new mongoose.Types.ObjectId(id));

			const products = await Product.find({ _id: { $in: validObjectCartIds } }).exec();

			const cartIdsToAdd = products.map((product) => product._id);

			await User.updateOne({ _id: userId }, { ...req.body });

			await User.updateOne({ _id: userId }, { $addToSet: { cart: { $each: cartIdsToAdd } } });
			//
		} else if (wishlistIds) {
			const objectWishlistIds = wishlistIds.map((id) => new mongoose.Types.ObjectId(id));

			const products = await Product.find({ _id: { $in: objectWishlistIds } }).exec();

			const wishlistIdsToAdd = products.map((product) => product._id);

			await User.updateOne({ _id: userId }, { ...req.body });

			await User.updateOne({ _id: userId }, { $addToSet: { wishlist: { $each: wishlistIdsToAdd } } });
			//
		} else {
			await User.updateOne({ _id: userId }, { ...req.body });
		}

		// for roles {...req.body, roles: JSON.parse(roles)}

		const result = await User.findById(userId).populate("cart wishlist").exec();

		res.status(200).json({
			message: `User ${name} is updated sucessfully`,
			status: "ok",
			status_code: 200,
			data: result,
		});
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const removeProductFromCart = async (req, res) => {
	try {
		const userId = req.params.id;
		const productId = req.params.productId;

		await User.updateOne({ _id: userId }, { $pull: { cart: productId } }, { new: true });

		const user = await User.findById(userId).populate("cart").exec();

		res.status(200).json({
			message: `Product removed from cart successfully`,
			status: "ok",
			status_code: 200,
			data: user,
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: err.message });
	}
};

const removeProductFromWishlist = async (req, res) => {
	try {
		const userId = req.params.id;
		const productId = req.params.productId;

		await User.updateOne({ _id: userId }, { $pull: { wishlist: productId } }, { new: true });

		const user = await User.findById(userId).populate("wishlist").exec();

		res.status(200).json({
			message: `Product removed from wishlist successfully`,
			status: "ok",
			status_code: 200,
			data: user,
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: err.message });
	}
};

const deleteUserById = async (req, res) => {
	try {
		const userId = req.params.id;
		if (!userId) return res.status(400).json({ message: "User id is required" });

		const user = await User.findById(userId).exec();
		if (!user) return res.status(404).json({ message: "User is not found" });

		const result = await user.deleteOne();

		res.status(200).json({
			message: `User ${user.name} is deleted sucessfully`,
			status: "ok",
			status_code: 200,
			data: result,
		});
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
};

module.exports = {
	getAllUsers,
	getUserById,
	getCurrentUser,
	handleNewUser,
	updateUserById,
	deleteUserById,
	removeProductFromCart,
	removeProductFromWishlist,
};
