const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

//Global middleware
app.use('/static', express.static('static'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

//Routes
const NGORoutes = require('./routes/NGO/index.js');
const UserRoutes = require('./routes/User/index.js');
const EventRoutes = require('./routes/Event/index.js');

app.use('/ngo/', NGORoutes);
app.use('/user/', UserRoutes);
app.use('/event/', EventRoutes);

//Errors

//When reaches here it means that did not enter on any of the urls above
app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  //Passes this data to the next middleware
  next(error);
});

//Handles any error thrown
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
      status: error.status
    }
  });
});

module.exports = app;
