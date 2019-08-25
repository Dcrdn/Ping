const mongoose = require('mongoose');

mongoose.connect(process.env.DB_URI, { useNewUrlParser: true });

module.exports = mongoose.connection;
