// process.env.NODE_ENV = 'development';
// if (process.env.NODE_ENV === 'development') {
require('dotenv').config();
// }
const mongoose = require('mongoose');
const config = require('config');
const express = require('express');
const app = express();
const helmet = require('helmet');
const cors = require('cors');

app.use(express.json());
app.use(helmet());
app.use(cors());
require('./startup/routes')(app);

mongoose.connect(process.env.DB_STRING, () => {
  console.log('Successfully connected to database');
});

app.listen(process.env.PORT, () => {
  console.log(`Started listening at port ${process.env.PORT}....`);
});
