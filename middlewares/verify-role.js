const errorHandler = require("../utils/error-handler");
const resErr = require("../utils/res-error");

const verifyRole = (...allowedRoles) => {
	try {
		return (req, res, next) => {
			if (!req?.roles) return resErr(res, 400, "No user role found");
			const rolesArray = [...allowedRoles];
			const result = rolesArray.map((role) => req?.roles.includes(role)).find((val) => val === true);
			// console.log(`Authorized:`, result);
			if (!result) return resErr(res, 401, "you don't have access for this");
			next();
		};
	} catch (err) {
		errorHandler(req, err);
	}
};

module.exports = verifyRole;
