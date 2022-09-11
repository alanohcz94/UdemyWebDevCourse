const express = require('express');
const route = express.Router();
const request = require('request');
const config = require('config');
const Profile = require('../../models/profile');
const User = require('../../models/user');
const { authenticateJwtToken } = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

/**
 *  Improvements:
 *  Add Update experience and education (PUT method/function)
 * 
 * 
 * 

/*
* @route Get/api/profile/me
* @desc Get my profile 
* @access Private
*/
route.get('/me', authenticateJwtToken, async (req,res) => {
	try {
		const profile = await Profile.findOne({user: req.user.id}).populate('user', ['name', 'avatar']);

		if(!profile) {
			return res.status(400).json({msg: "No profile found."});
		}

	} catch(err) {
		console.log();
		res.status(500).send(`Server Error: ${err.message}`);
	}
});


/*
* @route Post/api/profile
* @desc Create or update a user profile
* @access Public
*/
route.post('/', [
		authenticateJwtToken, [
			check('status', 'Status is required.').not().isEmpty(),
			check('skills', 'Skills is required').not().isEmpty()
		]
	], 
	async (req,res) => {
		const errors = validationResult(req);
		if(!errors.isEmpty()) {
			return res.status(400).json({errors: errors.array() });
		}
		const {company, website, location, bio, status, githubusername, skills, youtube, facebook, instagram, linkedin } = req.body;

		// Build profile object
		const profileFields = {};
		profileFields.user = req.user.id;
		if(company) profileFields.company = company;
		if(website) profileFields.website = website;
		if(location) profileFields.location = location;
		if(bio) profileFields.bio = bio;
		if(status) profileFields.status = status;
		if(githubusername) profileFields.githubusername = githubusername;
		if(skills) {
			profileFields.skills = skills.split(',').map(skill => skill.trim());
		}

		profileFields.social = {};
		if(youtube) profileFields.social.youtube = youtube;
		if(facebook) profileFields.social.facebook = facebook;
		if(instagram) profileFields.social.instagram = instagram;
		if(linkedin) profileFields.social.linkedin = linkedin;

		try {
			let profile = Profile.findOne({user: req.user.id});

			// Update Profile
			if(profile){
				profile = await Profile.findOneAndUpdate(
						{user: req.user.id}, 
						{$set: profileFields}, 
						{new: true}
					);

				return res.json(profile);
			}
			// Create Profile
			profile = new Profile(profileFields);
			await profile.save();
			res.json(profile);

		} catch(err) {
			res.status(500).send(`Server Error ${err.message}`);
		}
	}
);

/*
* @route Get/api/profile
* @desc Get all profiles
* @access Public
*/
route.get('/', async (req,res) => {
	try {
		const profiles = await Profile.find().populate('user',['name','avatar']);
		res.json(profiles);
	} catch(err) {
		res.status(500).send(`Server Error ${err.message}`);
	}
});

/*
* @route Get/api/profile/user/:id
* @desc Get profile by user ID
* @access Public
*/
route.get('/user/:id', async (req,res) => {
	try {
		const profile = await Profile.findOne({user:req.params.user_id}).populate('user',['name','avatar']);
		
		if(!profile) return res.status(400).json({msg: `Profile not found - Id: ${req.params.user_id}`})

		res.json(profile);

	} catch(err) {
		if(err.kind='ObjectId') {
			return res.status(400).json({msg: `Profile not found - Id: ${req.params.user_id}`})
		}
		res.status(500).send(`Server Error ${err.message}`);
	}
});

/*
* @route DELETE /api/profile
* @desc Delete profile, user & posts
* @access Public
*/
route.delete('/', authenticateJwtToken, async(req, res) => {
	try {
		// @todo - removes users posts

		// Remove profile
		await Profile.findOneAndRemove({ user: req.user.id });
		// Remove user
		await User.findOneAndRemove({ _id: req.user.id });

		res.json({msg: 'User removed.'});
	} catch(err) {
		res.status(500).send(`Server Error: ${err.message}`);
	}
});

/*
* @route PUT /api/profile/experience
* @desc Add profile experience
* @access Private
*/
route.put('/experience', 
	[
		authenticateJwtToken, 
		[
			check('title', 'Title is required.').not().isEmpty(),
			check('company', 'Company is required').not().isEmpty(),
			check('from', 'From date is required').not().isEmpty(),
			check('current', 'Current is required').not().isEmpty()
		]
	], 
	async(req,res) =>{
		const errors = validationResult(req);
		if(!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { title, company, location, from, to, current, description } = req.body;

		const newExp = { title, company, location, from, to, current, description };

		try {
			const profile =await Profile.findOne({user: req.user.id});

			// unshift method is the same as method as push but it pushes to the beginning of the array/object rather then the back 
			profile.experience.unshift(newExp);
			await profile.save();

			res.json(profile);
		} catch(err) {
			res.status(500).send(`Server Error: ${err.message}`);
		}
	}
);

/*
* @route DELETE /api/profile/experience/:exp_id
* @desc Delete user experience
* @access Private
*/
route.delete('/experience/:exp_id', authenticateJwtToken, async(req, res) => {
	try {
		// @todo - removes users posts

		// Get profile
		const profile = await Profile.findOne({ user: req.user.id });

		// Get remove index
		const removeIndex = profile.experience.map(item=> item.id).indexOf(req.params.exp_id);
		profile.experience.splice(removeIndex, 1);
		await profile.save();

		res.json(profile);
	} catch(err) {
		res.status(500).send(`Server Error: ${err.message}`);
	}
});

/*
* @route PUT /api/profile/education
* @desc Add profile education
* @access Private
*/
route.put('/education', 
	[
		authenticateJwtToken, 
		[
			check('school', 'School is required.').not().isEmpty(),
			check('degree', 'Degree is required').not().isEmpty(),
			check('from', 'From date is required').not().isEmpty(),
			check('fieldofstudy', 'Field Of Study is required.').not().isEmpty(),
			check('current', 'Current is required').not().isEmpty()
		]
	], 
	async(req,res) =>{
		const errors = validationResult(req);
		if(!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { school, degree, fieldofstudy, from, to, current, description } = req.body;

		const newEdu = { school, degree, fieldofstudy, from, to, current, description };

		try {
			const profile =await Profile.findOne({user: req.user.id});

			// unshift method is the same as method as push but it pushes to the beginning of the array/object rather then the back 
			profile.education.unshift(newEdu);
			await profile.save();

			res.json(profile);
		} catch(err) {
			res.status(500).send(`Server Error: ${err.message}`);
		}
	}
);

/*
* @route DELETE /api/profile/education/:edu_id
* @desc Delete user education
* @access Private
*/
route.delete('/education/:edu_id', authenticateJwtToken, async(req, res) => {
	try {
		// @todo - removes users posts

		// Get profile
		const profile = await Profile.findOne({ user: req.user.id });

		// Get remove index
		const removeIndex = profile.education.map(item=> item.id).indexOf(req.params.edu_id);
		profile.education.splice(removeIndex, 1);
		await profile.save();

		res.json(profile);
	} catch(err) {
		res.status(500).send(`Server Error: ${err.message}`);
	}
});

/*
* @route GET /api/profile/github/:username
* @desc Get user github repos
* @access Public
*/
route.get('/github/:username', async(req, res) => {
	try {
		const options = {
			uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get('githubClientId')}&client_secret=${config.get('githubSecretId')}`, method: 'GET', headers: {'user-agent': 'node.js'}
		};

		request(options, (error,response,body) => {
			if(response.statusCode !== 200) {
				return res.status(404).json({msg: 'Unable to find Github profile.'});
			}

			res.json(JSON.parse(body));
		})
	} catch(err) {
		res.status(500).send(`Server Error: ${err.message}`);
	}
})

	

module.exports = route;