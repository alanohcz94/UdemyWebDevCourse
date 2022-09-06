const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

const connectDB = async () => {
	try{
		// Action to connect to DB
		await mongoose.connect(db, {
			useNewUrlParser: true
		});

		console.log("Successfully Connected to DB");
	} catch(err) {
		console.log(`Failed Connected to DB:
			Error Message ${err.message}`);
		// Exit process when failure
		process.exit(1);
	}
}

module.exports = connectDB;