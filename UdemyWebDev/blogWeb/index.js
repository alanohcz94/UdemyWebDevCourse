const express = require('express');
const app = express();
const https = require('https');

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res)=>{
	/*
		// perform a GET request to an API call
		const url = <full path> including https://
		https(<url>, (respone)=> {
			console.log(respone);
			
			// get response then get response data 
			respone.on('data', (data)=>{
				console.log(data); -> HEX
				const weatherJsonData = JSON.parse(data);
				// extract the data wanted
				const ...
				res.write(<content that want to show>);
				res.send();
			})
		})

	*/

})




app.listen(3000 , ()=>{
	console.log("App is running on port 3000");
})