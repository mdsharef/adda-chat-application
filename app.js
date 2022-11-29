// external imports
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const moment = require('moment');
const http = require('http');

// internal imports
const { notFoundHandler, errorHandler } = require('./middlewares/commons/errorHandler');
const setRouter = require('./routes/routes')

const app = express();
const server = http.createServer(app)
dotenv.config();

// socket creation
const io = require('socket.io')(server);
global.io = io;

// set moment as app locals
app.locals.moment = moment;

// database connection
mongoose.connect(process.env.MONGO_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('database connected successfully!'))
.catch(err => console.log(err));

// request parsers && middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// set view engine
app.set('view engine', 'ejs')
app.set('views', 'views')
// set public folder
app.use(express.static('public'));

// parse cookie
app.use(cookieParser(process.env.COOKIE_SECRET));

// routing setup
setRouter(app)

// 404 not found error
app.use(notFoundHandler)

// common errors
app.use(errorHandler)

// app listen
server.listen(process.env.PORT, ()=> console.log(`App is runnig on port ${process.env.PORT}`));