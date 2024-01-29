const errorHandler = (req, err) => {
	console.error(`Error in ${req.method} ${req.path} : `, err.stack);

	res.status(500).json({
		error: "InternalError",
		code: "500",
		message: "An internal server error occurred",
		details: err.message,
	});
};

module.exports = errorHandler;
