const express = require('express');
const route = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const {check, validationResult } = require('express-validator');

const User = require('../../models/user');

/*
* @route post/api/users
* @desc Register user
* @access Public
* @firstParam route endpoint
* @secondParam can act as a middleware
* @thirdParam request and respone callback function
*/
route.post('/', [
		check('name', 'Name is required.').not().isEmpty(),
		check('email', 'Please include valid email.').isEmail(),
		check('password').isLength({min: 6})
	] , async (req,res) => {
	const errors = validationResult(req);
	if(!errors.isEmpty()){
		return res.status(400).json({ errors: errors.array() });
	}

	const { name, email, password } = req.body;

	try {
		// Check if user exists
		const findUser = await User.findOne({email});
		if(findUser) {
			return res.status(400).json({errors: [{msg: 'User already exists'}] });
		}
		// Get users gravatar (email)
		const avatar = gravatar.url(email, {
			// size
			// r-rated img
			// default -> gives a default icon
			s: '200',
			r: 'pg',
			d: 'mm'
		});

		// Create Register User
		const user = new User({name, email, avatar, password});

		// Encrypt Password
		// Create a salt
		const salt = await bcrypt.genSalt(10);
		user.password = await bcrypt.hash(password, salt);

		await user.save();

		const payload = {
			user: {
				id: user.id
			}
		};

		// Sign the secret 
		jwt.sign(
			payload, 
			config.get('jwtToken'), 
			{expiresIn: 360000},
			(err, token)=>{
				if(err) throw err;
				res.json({token});
			}
		);	
	
	} catch(err) {
		res.status(500).send(`Server Error: ${err.message}`);
	}
});


module.exports = route;