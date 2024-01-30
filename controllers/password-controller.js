const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const errorHandler = require("../utils/error-handler");
const resErr = require("../utils/res-error");

const handleChangePassword = async (req, res) => {
	try {
		const { currentPassword, newPassword } = req.body;

		if (!currentPassword || !newPassword) return resErr(res, 400, "Please fill all the fields");

		const user = await User.findById(req.id).exec();

		const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

		if (!isPasswordValid) {
			return resErr(res, 401, "Invalid current password");
		}

		const hashedPassword = await bcrypt.hash(newPassword, 10);

		user.password = hashedPassword;
		await user.save();

		res.status(200).json({ message: "Password updated successfully", status: "ok", status_code: 200, user: user.name });
	} catch (err) {
		errorHandler(req, err);
	}
};

const transporter = nodemailer.createTransport({
	host: process.env.SMTP_HOST,
	port: process.env.SMTP_PORT,
	auth: {
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_PASS,
	},
});

const handleForgotPassword = async (req, res) => {
	try {
		const { email } = req.body;

		if (!email) return resErr(res, 400, "Email is required");

		const user = await User.findOne({ email }).exec();

		if (!user) resErr(res, 404, "Email is not found!");

		const resetToken = await jwt.sign({ id: user._id }, process.env.RESET_TOKEN, { expiresIn: "1h" });

		// console.log(resetToken);
		// console.log(req.headers.host);
		const resetLink = `http://localhost:5173/reset/${resetToken.replace(/\./g, "---")}`;
		const mailOptions = {
			from: process.env.SMTP_FROM,
			to: email,
			subject: "This is for your exclusive's account password reset.",
			html: `<p>Click on the following link to update your password for your exclusive account: 
            <a href=${resetLink}>Reset Link</> </p>`,
		};

		await transporter.sendMail(mailOptions);

		res.status(200).json({ message: "Email for reset password sent successfully", status: "ok", status_code: 200, user: user.name });
	} catch (err) {
		errorHandler(req, err);
	}
};

const handleResetPassword = async (req, res) => {
	try {
		const resetToken = req.params.token;
		// console.log(resetToken);
		const { newPassword } = req.body;

		const decoded = jwt.verify(resetToken, process.env.RESET_TOKEN);
		const user = await User.findById(decoded.id);

		if (!user) return resErr(res, 404, "User is not found");

		const hashedPassword = await bcrypt.hash(newPassword, 10);

		user.password = hashedPassword;
		await user.save();

		res.status(200).json({ message: "Password reset successfully", status: "ok", status_code: 200, user: user.name });
	} catch (err) {
		errorHandler(req, err);
	}
};

module.exports = { handleChangePassword, handleForgotPassword, handleResetPassword };
