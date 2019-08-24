const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

//Global middleware
app.use('/static', express.static('static'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

//DB
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true });
mongoose.connection.once('open', () => {
  console.log('<< connected to db');
});

//Routes
const NGORoutes = require('./routes/NGO/index.js');
const UserRoutes = require('./routes/User/index.js');
app.use('/NGO/', NGORoutes);
app.use('/user/', UserRoutes);

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