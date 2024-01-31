const resSuccess = (res, code, message, data) => {
	let resMessage;
	switch (code) {
		case 200:
			resMessage = message ? message : "OK";
			break;
		case 201:
			resMessage = message ? message : "Created";
			break;
		case 204:
			resMessage = message ? message : "No Content";
			break;
		default:
			resMessage = "Successful Request";
			break;
	}

	res.status(code).json({
		status: "success",
		code: code,
		message: resMessage,
		data: data,
	});
};

module.exports = resSuccess;
