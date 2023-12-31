require(express-async-errors);//Downloaded NPM module - Don't need to store result in const - optional approach
const winston = require('winston');
require('winston-mongodb'); 
const error = require('./middle/error');
const config = require('config');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');
const express = require('express');
const app = express();

//Just let winston handle exceptions without process object - Can't handle unhandled rejections though. 
winston.handleExceptions(
  new winston.transports.File({ filename: 'uncaughtExceptions.log' }));//File system doesn't crash like MDB can

process.on('unhandledRejection', (ex) => {//Throws an unhandled promise rejection
  throw ex;//Throws an exception so that winston can handle it.
});

winston.add(winston.transports.File, { filename: 'logfile.log'});
winston.add(winston.transports.MongoDB, { db: 'mongodb://localhost/vidly'});

if (!config.get('jwtPrivateKey')) {
  console.error('FATAL ERROR: jwtPrivateKey is not defined.');
  process.exit(1);
}

mongoose.connect('mongodb://localhost/vidly')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'));

app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use(error);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));