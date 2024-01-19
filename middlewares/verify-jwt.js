const jwt = require("jsonwebtoken");

const verifyJWT = async (req, res, next) => {
	try {
		const BearerToken = req.headers["authorization"];
		// console.log(BearerToken);
		if (!BearerToken) {
			return res.status(401).json({ error: "Unauthorized" });
		}
		const token = BearerToken.replace(/^Bearer\s$/, "");

		jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
			if (err) return res.sendStatus(403);
			req.user = decoded.userInfo.name;
			req.roles = decoded.userInfo.role;
			req.id = decoded.userInfo.id;
			// console.log(req.roles);
			// console.log(req.id);
			next();
		});
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

module.exports = verifyJWT;
