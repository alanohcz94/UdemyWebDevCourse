const express = require('express');
const route = express.Router();

/*
* @route Get/api/post
* @desc Test route
* @access Public
*/
route.get('/', (re,res) => {
	res.send("Hello there post route");
});


module.exports = route;