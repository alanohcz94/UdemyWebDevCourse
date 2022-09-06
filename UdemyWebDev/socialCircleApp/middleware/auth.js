const jwt = require('jsonwebtoken');
const config = require('config');

module.exports.authenticateJwtToken = (req, res, next) => {
	// Get token from header
	const token = req.header('x-auth-token');

	// Check if no token
	if(!token) {
		return res.status(401).json({msg: "No token, Access denied"});
	}

	// Verify token
	try {
		const decodeToken = jwt.verify(token, config.get('jwtToken'));
		req.user = decodeToken.user;
		next();

	} catch(err) {
		res.status(401).json({msg:"Token is not valid or empty."});
	}
}


