const express = require('express');
const route = express.Router();

/*
* @route Get/api/profile
* @desc Test route
* @access Public
*/
route.get('/', (re,res) => {
	res.send("Hello there profile route");
});


module.exports = route;