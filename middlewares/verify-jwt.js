const jwt = require("jsonwebtoken");

const verifyJWT = async (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (!authHeader.startsWith("Bearer ")) return res.sendStatus(401);
	const token = authHeader.split(" ")[1];
	console.log(token);

	jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
		if (err) return res.sendStatus(403);
		req.user = decoded.userInfo.name;
		req.roles = decoded.userInfo.role;
		console.log(req.roles);
		next();
	});
};

module.exports = verifyJWT;
