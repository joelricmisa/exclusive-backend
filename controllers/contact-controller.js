const nodemailer = require("nodemailer");
const errorHandler = require("../utils/error-handler");

const transporter = nodemailer.createTransport({
	host: process.env.SMTP_HOST,
	port: process.env.SMTP_PORT,
	auth: {
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_PASS,
	},
});

const handleMessage = async (req, res) => {
	try {
		const { name, email, message, phone } = req.body;

		if (!email || !name || !message || !phone) return res.status(400).json({ message: "Pleass fill up all input fields" });

		const mailOptions = {
			from: email,
			to: process.env.SMTP_TO,
			subject: `Message from user: ${name} `,
			html: `<p>Message: ${message}</p> <p>Phone Number:${phone}</p>`,
		};

		await transporter.sendMail(mailOptions);

		res.status(200).json({ message: "Message sent successfully!", status: "ok", status_code: 200, user: email });
	} catch (err) {
		errorHandler(req, err);
	}
};

module.exports = { handleMessage };
