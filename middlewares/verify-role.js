const verifyRole = (...allowedRoles) => {
	try {
		return (req, res, next) => {
			if (!req?.roles) return res.sendStatus(401);
			const rolesArray = [...allowedRoles];
			const result = rolesArray.map((role) => req?.roles.includes(role)).find((val) => val === true);
			console.log(`Authorized:`, result);
			if (!result) return res.sendStatus(401);
			next();
		};
	} catch (err) {
		console.log(err.message);
	}
};

module.exports = verifyRole;
