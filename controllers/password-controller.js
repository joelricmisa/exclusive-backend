const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

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

const transporter = nodemailer.createTransport({
	host: "smtp-relay.sendinblue.com",
	port: 587,
	auth: {
		user: "joelriccmisa@gmail.com",
		pass: "RXpO3fH0ZVF6gMQj",
	},
});

const handleForgotPassword = async (req, res) => {
	try {
		const { email } = req.body;

		if (!email) return res.status(400).json({ message: "Email is required" });

		const user = await User.findOne({ email }).exec();

		if (!user) return res.status(404).json({ message: "User is not found" });

		const resetToken = await jwt.sign({ id: user._id }, process.env.RESET_TOKEN, { expiresIn: "1h" });

		// console.log(resetToken);
		// console.log(req.headers.host);
		const resetLink = `http://localhost:5173/reset/${resetToken.replace(/\./g, "-")}`;
		const mailOptions = {
			from: "exclusive_shop@gmail.com",
			to: email,
			subject: "Reset Password",
			html: `<p>Click on the following link to reset your password: 
            <a href=${resetLink}>Reset Page</> </p>`,
		};

		await transporter.sendMail(mailOptions);

		res.status(200).json({ message: "Email for reset password sent successfully", status: "ok", status_code: 200, user: user.name });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

const handleResetPassword = async (req, res) => {
	try {
		const resetToken = req.params.token;
		// console.log(resetToken);
		const { newPassword } = req.body;

		const decoded = jwt.verify(resetToken, process.env.RESET_TOKEN);
		const user = await User.findById(decoded.id);

		if (!user) return res.status(404).json({ message: "User is not found" });

		const hashedPassword = await bcrypt.hash(newPassword, 10);

		user.password = hashedPassword;
		await user.save();

		res.status(200).json({ message: "Password reset successfully", status: "ok", status_code: 200, user: user.name });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

module.exports = { handleChangePassword, handleForgotPassword, handleResetPassword };
