const express = require('express');
const route = express.Router();
const { check, validationResult } = require('express-validator');
const { authenticateJwtToken } = require('../../middleware/auth');

const Post = require('../../models/post');
const User = require('../../models/user');
const Profile = require('../../models/profile');


/*
* @route POST /api/post
* @desc Create a post
* @access Private
*/
route.post('/', authenticateJwtToken, 
	[
		check('text', 'Text is reuqired.').not().isEmpty()
	],
	async (req ,res) => {
		const errors = validationResult(req);
		if(!errors.isEmpty()) {
			return res.status(400).json({errors : errors.array()});
		}

		try {
			const user = await User.findById(req.user.id).select('-password');

			const newPost = new Post({
				text: req.body.text,
				name:user.name,
				avatar: user.avatar,
				user: req.user.id
			});

			const post = await newPost.save();

			res.json(post);

		} catch(err) {
			res.status(500).send(`Server Error: ${err.message}`);
		}
	}
);

/*
* @route Get /api/post
* @desc Get all post
* @access Private
*/
route.get('/', authenticateJwtToken, async( req, res) => {
	try {
		const posts = await Post.find().sort({ date: -1 });
		res.json(posts);
	} catch(err) {
		res.status(500).send(`Server Error ${err.message}`);
	}
});

/*
* @route Get /api/post/:id
* @desc Get post by Id
* @access Private
*/
route.get('/:id', authenticateJwtToken, async( req, res) => {
	try {
		const posts = await Post.findById(req.params.id);
		if(!posts) {
			return res.status(404).json({msg : 'No post found.'});
		}
		res.json(posts);
	} catch(err) {
		if(err.kind === 'ObjectId') {
			return res.status(404).json({msg : 'No post found.'});
		}
		res.status(500).send(`Server Error ${err.message}`);
	}
});

/*
* @route Delete /api/post/:id
* @desc Delete post by Id
* @access Private
*/
route.delete('/:id', authenticateJwtToken, async( req, res) => {
	try {
		const posts = await Post.findById(req.params.id);

		if(!posts) {
			return res.status(404).json({msg : 'No post found.'});
		} else {
			// Check if user can delete post 
			if(posts.user.toString() === req.user.id) {
				await posts.remove();
			} else { 
				return res.status(401).json({msg: 'Unauthorized action.'})
			}
		}

		res.json(posts);
	} catch(err) {
		if(err.kind === 'ObjectId') {
			return res.status(404).json({msg : 'No post found.'});
		}
		res.status(500).send(`Server Error ${err.message}`);
	}
});

/*
* @route Put /api/post/like/:id
* @desc Like a post
* @access Private
*/
route.put('/like/:id', authenticateJwtToken, async( req, res) => {
	try {
		const post = await Post.findById(req.params.id);

		// Check if the post has already been liked by the same user
		if(post.likes.filter(likeUser => likeUser.user.toString() === req.user.id).length > 0) {
			return res.status(400).json({msg: 'Post already liked.'});
		} 
		
		post.likes.unshift({user : req.user.id});

		await post.save();

		res.json(post.likes);
	} catch(err) {
		res.status(500).send(`Server Error ${err.message}`);
	}
});

/*
* @route Put /api/post/like/:id
* @desc unlike a post
* @access Private
*/
route.put('/unlike/:id', authenticateJwtToken, async( req, res) => {
	try {
		const post = await Post.findById(req.params.id);

		// Check if the post has already been unliked by the same user
		if(post.likes.filter(likeUser => likeUser.user.toString() === req.user.id).length === 0) {
			return res.status(400).json({msg: 'Post has not yet been liked.'});
		} 
		
		// Get remove index
		const removeIndex = post.likes.map(likeUser => likeUser.user.toString().indexOf(req.user.id));

		post.likes.splice(removeIndex, 1);

		await post.save();

		res.json(post.likes);
	} catch(err) {
		res.status(500).send(`Server Error ${err.message}`);
	}
});

/*
* @route POST /api/post/:id/comment
* @desc Comment on a post
* @access Private
*/
route.post('/:id/comment', authenticateJwtToken, 
	[
		check('text', 'Comments body is reuqired.').not().isEmpty()
	],
	async (req ,res) => {
		const errors = validationResult(req);
		if(!errors.isEmpty()) {
			return res.status(400).json({errors : errors.array()});
		}

		try {
			const user = await User.findById(req.user.id).select('-password');
			const post = await Post.findById(req.params.id);

			const newPostComment = {
				text: req.body.text,
				name:user.name,
				avatar: user.avatar,
				user: req.user.id
			};

			post.comments.unshift(newPostComment);

			await post.save();

			res.json(post.comments);

		} catch(err) {
			res.status(500).send(`Server Error: ${err.message}`);
		}
	}
);

/*
* @route POST /api/post/:post_id/comment/:comment_id
* @desc Comment on a post
* @access Private
*/
route.post('/:post_id/comment/:comment_id', authenticateJwtToken, async (req, res) => {
	try {
		const post = await Post.findById(req.params.post_id);

		if(!post) {
			return res.status(404).json({msg: 'No post found'});
		}

		// Post found get post comment
		const comment = post.comments.find(eachComment => eachComment.id.toString() === req.params.comment_id);

		if(!comment) {
			return res.status(404).json({msg: 'No comment found'});
		}

		// Check User
		if(comment.user.toString() !== req.user.id) {
			return res.status(401).json({msg: 'Unauthorized action'});
		}

		await comment.remove();

		res.json(post.comments);
	} catch(err) {
		res.status(500).send(`Server Error ${err.message}`);
	}
});

// Update comments


module.exports = route;