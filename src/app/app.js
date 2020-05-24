const express = require('express');
require('dotenv').config();
const morgan = require('morgan');
const errorhandler = require('errorhandler');
const notifier = require('node-notifier');
const fs = require('fs');
const VError = require('verror').VError;
const WError = require('verror').WError;
const path = require('path');
const routes = require('./routes');


const app = express();

const httpLogFile = fs.createWriteStream(path.join(process.cwd(), 'http.log'));
app.use(morgan('combined', { stream: httpLogFile }));

app.use(routes);

if (process.env.NODE_ENV === 'development') {
  app.use(errorhandler());
}

if (process.env.NODE_ENV === 'production') {
  app.use(function (err, req, res, _next) {
    console.error(err);
    res.status = res.status || 500;
    res.json({
      message: err.message,
      error: {}
    });

    const title = `Error in ${req.method} ${req.url}`;

    notifier.notify({
      title,
      message: err.message
    });
  });
}

function errorNotification(err, str, req) {
  console.log('In')
  const title = `Error in ${req.method} ${req.url}`;

  notifier.notify({
    title,
    message: str
  });
}

module.exports = app;