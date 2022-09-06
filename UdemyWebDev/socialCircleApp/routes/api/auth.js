const express = require('express');
const route = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const {check, validationResult } = require('express-validator');
const { authenticateJwtToken } = require('../../middleware/auth')
const User = require('../../models/user');

/*
* @route Get/api/auth
* @desc Authenticate Token
* @access Public
*/
route.get('/', authenticateJwtToken, async (req,res) => {
	try{
		// select is to leave out the part we want to in this case password
		const user = await User.findById(req.user.id).select('-password');
		res.json(user);
	} catch(err) {
		res.status(500).send('Server Error');
	}
});

/*
* @route Post/api/auth
* @desc Authenticate user and get user token
* @access Public
*/
route.post('/', 
	[
		check('email', 'Email is required').isEmail(),
		check('password', 'Password is required').exists()
	],
 	async (req, res) => {
		const errors = validationResult(req);
		if(!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}	

		const { email, password } = req.body;

		try {
			// Find user 
			const user = await User.findOne({email});
			if(!user) {
				return res.status(400).json({ errors: [{msg: 'Invalid Credentials'}]})
			}

			// Get user and compare password
			const isPassMatch = await bcrypt.compare(password, user.password);
			if(!isPassMatch) {
				return res.status(400).json({errors: [{msg: 'Invalid Credentials'}]});
			}

			const payload = {
				user: {
					id: user.id
				}
			};

			jwt.sign(
				payload,
				config.get('jwtToken'),
				{expiresIn: 360000},
				(err, token) => {
					if(err) throw err;
					res.json({token});
				}
			);

		} catch(err) {
			res.status(500).send(`Server Error: ${err.message}`);
		}

	}
);




module.exports = route;