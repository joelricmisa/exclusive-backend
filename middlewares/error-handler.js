const handleError = (err, req, res, next) => {
	console.log(err.stack);
	res.status(err.status || 500);
	res.json({ error: err.message });
};

module.exports = handleError;
