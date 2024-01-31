const nodemailer = require("nodemailer");
const errorHandler = require("../utils/error-handler");
const resErr = require("../utils/res-error");
const resSuccess = require("../utils/res-success");

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

		if (!email || !name || !message || !phone) return resErr(res, 400, "Pleass fill up all input fields");

		const mailOptions = {
			from: email,
			to: process.env.SMTP_TO,
			subject: `Message from user: ${name} `,
			html: `<p>Message: ${message}</p> <p>Phone Number:${phone}</p>`,
		};

		await transporter.sendMail(mailOptions);

		resSuccess(res, 200, "Message sent successfully!", email);
	} catch (err) {
		errorHandler(req, err);
	}
};

module.exports = { handleMessage };
