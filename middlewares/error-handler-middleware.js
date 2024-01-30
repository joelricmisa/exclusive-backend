const resErr = require("../utils/res-error");
const handleError = (err, req, res, next) => {
	console.error(`Error middleware caught: `, err.stack);
	return resErr(res, err.status || 500, err.message);
};

module.exports = handleError;
