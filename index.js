require('dotenv').config();
const config = require('config');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const helmet = require('helmet');
const cors = require('cors');

const apiEndPoint = config.get('apiEndPoint');
const batchRouter = require('./routes/batches');

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(apiEndPoint + 'batches', batchRouter);

mongoose.connect('mongodb://localhost/aun-manager', () => {
  console.log('Successfully connected to database');
});

app.listen(config.get('testPort'), () => {
  console.log(`Started listening at port ${config.get('testPort')}...`);
});
