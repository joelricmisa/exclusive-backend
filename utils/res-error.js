const resErr = (res, code, details) => {
	let message;
	switch (code) {
		case 400:
			message = "Bad Request";
			break;
		case 401:
			message = "Unauthorized";
			break;
		case 403:
			message = "Forbidden";
			break;
		case 404:
			message = "Not Found";
			break;
		case 409:
			message = "Conflict";
			break;
		default:
			message = "Internal Error";
			break;
	}

	res.status(code).json({
		status: "error",
		code: code,
		message: message,
		details: details,
	});
};

module.exports = resErr;

// res.status(500).json({
// 	error: "InternalError",
// 	code: "500",
// 	message: "An internal server error occurred",
// 	details: err.message,
// });
