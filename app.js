const express = require('express');
const process = require('process');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const router = require('./routes');
const { DB_CONN, PORT } = require('./config');

process.on('uncaughtException', (err, origin) => {
  console.log(`${origin} ${err.name} c текстом ${err.message} не была обработана. Обратите внимание!`);
});

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

mongoose.connect(DB_CONN);

app.listen(PORT, () => {
  console.log('start server');
});
