const User = require("../models/User");
const bcrypt = require("bcrypt");
const Product = require("../models/Product");
const mongoose = require("mongoose");
const errorHandler = require("../utils/error-handler");
const resErr = require("../utils/res-error");

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
		errorHandler(req, err);
	}
};

const getUserById = async (req, res) => {
	try {
		const userId = req.params.id;
		if (!userId) return resErr(res, 400, "User id is required!");

		const user = await User.findById(userId, "-password -__v").populate("cart").exec();
		if (!user) return resErr(res, 404, "User is not found");

		res.status(200).json({
			message: "User displayed successfully",
			status: "ok",
			status_code: 200,
			data: user,
		});
	} catch (err) {
		errorHandler(req, err);
	}
};

const getCurrentUser = async (req, res) => {
	try {
		const id = req.id;
		if (!id) return resErr(res, 401, "Invalid credentials");

		const user = await User.findById(id, "-password -__v").populate({ path: "cart.product_id" }).populate("wishlist").exec();
		if (!user) return resErr(res, 403, "Invalid credentials");

		res.status(200).json({
			message: "Get current user successfully",
			status: "ok",
			status_code: 200,
			data: user,
		});
	} catch (err) {
		errorHandler(req, err);
	}
};

const handleNewUser = async (req, res) => {
	try {
		const { name, email, password, roles } = req.body;
		if (!name || !email || !password) return resErr(res, 400, "Please fill up all inputs.");

		const duplicate = await User.findOne({ email }).exec();
		if (duplicate) return resErr(res, 409, "This email is already used!");

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
		errorHandler(req, err);
	}
};

const updateUserById = async (req, res) => {
	try {
		const { name, email } = req.body;
		const userId = req.params.id;

		if (!userId) return resErr(res, 400, "User id is required");

		const user = await User.findById(userId).exec();

		if (!user) return resErr(res, 404, "This user is not found");

		if (!name || !email) return resErr(res, 400, "Please fill up all inputs");

		await User.updateOne({ _id: userId }, { ...req.body });

		// for roles {...req.body, roles: JSON.parse(roles)}

		const result = await User.findById(userId).populate("cart wishlist").exec();

		res.status(200).json({
			message: `User ${name} is updated sucessfully`,
			status: "ok",
			status_code: 200,
			data: result,
		});
	} catch (err) {
		errorHandler(req, err);
	}
};

const deleteUserById = async (req, res) => {
	try {
		const userId = req.params.id;
		if (!userId) return resErr(res, 400, "User id is required");

		const user = await User.findById(userId).exec();
		if (!user) return resErr(res, 404, "User is not found");

		const result = await user.deleteOne();

		res.status(200).json({
			message: `User ${user.name} is deleted sucessfully`,
			status: "ok",
			status_code: 200,
			data: result,
		});
	} catch (err) {
		errorHandler(req, err);
	}
};

const updateCart = async (req, res) => {
	try {
		const userId = req.params.id;
		const { product_id, quantity } = req.body;

		if (!product_id || !quantity) {
			return resErr(res, 400, "Product ID and quantity are required");
		}

		const user = await User.findById(userId);

		if (!user) {
			return resErr(res, 404, "User not found");
		}

		const product = await Product.findById(product_id);

		if (!product) {
			return resErr(res, 404, "Product not found");
		}

		const existingCartItem = user.cart.find((item) => item.product_id?.equals(product_id));

		if (existingCartItem) {
			existingCartItem.quantity = quantity;
			existingCartItem.price = (Number(product.price) - Number(product.price) * Number(product?.discount / 100)) * product.quantity;
		} else {
			user.cart.push({
				product_id,
				quantity,
				price: (Number(product.price) - Number(product.price) * Number(product?.discount / 100)) * product.quantity,
			});
		}

		await user.save().then((data) => data.populate({ path: "cart.product_id" }));

		res.json(user);
	} catch (err) {
		errorHandler(req, err);
	}
};

const removeCartItem = async (req, res) => {
	try {
		const userId = req.params.id;
		const { product_id } = req.body;

		if (!product_id) {
			return resErr(res, 400, "Product ID is required");
		}

		const user = await User.findById(userId);

		if (!user) {
			return resErr(res, 404, "User not found");
		}

		user.cart = user.cart.filter((item) => !item.product_id.equals(product_id));

		await user.save().then((data) => data.populate({ path: "cart.product_id" }));

		res.json(user);
	} catch (err) {
		errorHandler(req, err);
	}
};

const updateWishlist = async (req, res) => {
	try {
		const userId = req.params.id;
		const { product_id } = req.body;

		if (!product_id) {
			return resErr(res, 400, "Product ID is required");
		}

		const user = await User.findById(userId);

		if (!user) {
			return resErr(res, 404, "User not found");
		}

		const product = await Product.findById(product_id);

		if (!product) {
			return resErr(res, 404, "Product not found");
		}

		const existingCartItem = user.wishlist.find((item) => item._id?.equals(product_id));

		if (!existingCartItem) {
			user.wishlist.push({
				_id: product_id,
			});
		}

		await user.save().then((data) => data.populate("wishlist"));

		res.json(user);
	} catch (err) {
		errorHandler(req, err);
	}
};

const removeWishlistItem = async (req, res) => {
	try {
		const userId = req.params.id;
		const { product_id } = req.body;

		if (!product_id) {
			return resErr(res, 400, "Product ID is required");
		}

		const user = await User.findById(userId);

		if (!user) {
			return resErr(res, 404, "User not found");
		}

		user.wishlist = user.wishlist.filter((item) => !item._id.equals(product_id));

		await user.save().then((data) => data.populate("wishlist"));

		res.json(user);
	} catch (err) {
		errorHandler(req, err);
	}
};

module.exports = {
	getAllUsers,
	getUserById,
	getCurrentUser,
	handleNewUser,
	updateUserById,
	deleteUserById,

	updateCart,
	removeCartItem,
	updateWishlist,
	removeWishlistItem,
};
