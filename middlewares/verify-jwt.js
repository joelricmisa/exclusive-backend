const jwt = require("jsonwebtoken");
const errorHandler = require("../utils/error-handler");
const resErr = require("../utils/res-error");

const verifyJWT = async (req, res, next) => {
	try {
		// const BearerToken = req.headers["authorization"];
		// if (!BearerToken) {
		// 	return res.status(401).json({ error: "Unauthorized" });
		// }
		// const token = BearerToken.replace(/^Bearer\s/, "");

		const authHeader = req.headers.authorization;
		if (!authHeader.startsWith("Bearer ")) return resErr(res, 401, "Invalid Credentials");
		const token = authHeader.split(" ")[1];

		jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
			if (err) return resErr(res, 403, "Invalid Credentials");
			req.user = decoded.userInfo.name;
			req.roles = decoded.userInfo.role;
			req.id = decoded.userInfo.id;
			// console.log(req.roles);
			// console.log(req.id);
			next();
		});
	} catch (err) {
		errorHandler(req, res, err);
	}
};

module.exports = verifyJWT;
