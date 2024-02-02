const errorHandler = (req, res, err) => {
	console.error(`Error in ${req.method} ${req.originalUrl} : `, err.stack);

	res.status(500).json({
		status: "error",
		code: 500,
		message: "An internal server error occurred",
		details: err.message,
	});
};

module.exports = errorHandler;
