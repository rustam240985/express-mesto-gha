const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const router = require('./routes');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '6435d41310a18a12fbd8b953',
  };

  next();
});
app.use(router);

mongoose.connect('mongodb://localhost:27017/mestodb');

app.listen(3001, () => {
  console.log('start server');
});
