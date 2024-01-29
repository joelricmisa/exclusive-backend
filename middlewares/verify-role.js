const errorHandler = require("../utils/error-handler");

const verifyRole = (...allowedRoles) => {
	try {
		return (req, res, next) => {
			if (!req?.roles) return res.send(400).json({ message: "No role found" });
			const rolesArray = [...allowedRoles];
			const result = rolesArray.map((role) => req?.roles.includes(role)).find((val) => val === true);
			// console.log(`Authorized:`, result);
			if (!result) return res.send(401).json({ message: "you don't have access for this" });
			next();
		};
	} catch (err) {
		errorHandler(req, err);
	}
};

module.exports = verifyRole;
