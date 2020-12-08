const createError = require('http-errors');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const config = require('./config/config').get(process.env.NODE_ENV);

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
mongoose.set('useCreateIndex', true);

dotenv.config();

// Import Routes APIs
const mangasRouterAPI = require('./routes/api/mangas');
const usersRouterAPI = require('./routes/api/users');
const oauth2RouterAPI = require('./routes/api/oauth2');

// Route Middlewares
app.use('/api/mangas', mangasRouterAPI);
app.use('/api/users', usersRouterAPI);
app.use('/api/oauth2', oauth2RouterAPI);

// catch 404 and forward to error handler
app.use((req, res, next) => {
	next(createError(404));
});

// error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
	// set locals, only providing error in development
	res.locals.message = err.message;

	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	// res.render('error');
});

// Connect to DB found here : https://cloud.mongodb.com/
mongoose.connect(config.DATABASE,
	{ useNewUrlParser: true, useUnifiedTopology: true },
	// eslint-disable-next-line no-console
	() => console.log('Connected to DB !'));

module.exports = app;
