const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArticlesSchema = new Schema({
	title: String,
	content: String
});

module.exports = mongoose.model('Articles', ArticlesSchema);