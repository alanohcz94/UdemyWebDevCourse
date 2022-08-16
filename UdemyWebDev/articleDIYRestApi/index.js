const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejs = require('ejs-mate');
const Article = require('./models/model')
const path = require('path');
const route = express.Router();
const app = express();
// for API calls I assume (I suppose there are better ways) ? 
const https = require('https');

app.use(express.urlencoded({ extended: true }));

// Set up connection to mongo
mongoose.connect('mongodb://127.0.0.1:27017/wikiArticle');
const db = mongoose.connection;
db.on("error", console.error.bind(console, 'Connection Error !'));
db.once("open", ()=>{
	console.log("Connection Succuessful !");
})

//Set up the view
app.set('views', path.join(__dirname, 'view'));
app.set('view engine', 'ejs');
app.engine('ejs', ejs);

// Set up access to public foler
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));


app.route('/art')
	.get(async(req, res)=>{
		const article = await Article.find({});
		res.render('all', {article});
	})
	.post(async(req, res)=>{
		const newArt = new Article(req.body);
		await newArt.save();
		res.redirect('/art');
	})
	.delete(async(req, res) =>{
		const remove = await Article.deleteMany();
		res.redirect('/art');
	})
	.patch(async(req, res) =>{
		
		res.redirect('/art');
	})

app.route('/art/:title')
	.get(async(req, res) =>{
		const {title} = req.params;	
		const article = await Article.find({'title': title})
		res.render ('all', {article});
	})
	.put(async(req, res) =>{
		const {title} = req.params;	
		const article = await Article.findOneAndUpdate({'title' : title}, {...req.body}, 
			{'overwrite': true});
		res.redirect('/art');
	})
	.patch(async(req, res) =>{
		const {title} = req.params;	
		const article = await Article.findOneAndUpdate({'title' : title}, {...req.body});
		res.redirect('/art');
	})
	.delete(async(req, res)=>{
		const {title} = req.params;
		const article = await Article.findOneAndDelete({'title': title});
		res.redirect('/art');
	})



app.listen(3000 , ()=>{
	console.log("App is running on port 3000");
})