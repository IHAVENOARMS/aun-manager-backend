require('dotenv').config();
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

mongoose.connect('mongodb://localhost/aun-manager', () => {
  console.log('Successfully connected to database');
});

app.listen(config.get('testPort'), () => {
  console.log(`Started listening at port ${config.get('testPort')}...`);
});
