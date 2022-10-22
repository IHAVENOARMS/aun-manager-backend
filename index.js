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

mongoose.connect(config.get('dbConnectionString'), () => {
  console.log('Successfully connected to database');
});

app.listen(config.get('port'), () => {
  console.log(`Started listening at port ${config.get('port')}...`);
});
