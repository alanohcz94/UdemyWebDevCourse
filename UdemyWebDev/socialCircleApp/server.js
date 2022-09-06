const express = require('express');
const connectDB = require('./config/db')

const app = express();

// Connect Database Function from config/db
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

const PORT = process.env.PORT || 5000;

app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/post', require('./routes/api/post'));


app.listen(PORT, () => console.log(`Server is listening to port ${PORT}`));