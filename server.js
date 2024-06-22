const path = require('path');
const { createRequestHandler } = require('@expo/server/adapter/express');
const express = require('express');
const compression = require('compression');
const morgan = require('morgan');

const CLIENT_BUILD_DIR = path.join(process.cwd(), '/client');
const SERVER_BUILD_DIR = path.join(process.cwd(), '/server');

const app = express();

app.use(compression());
app.disable('x-powered-by');
process.env.NODE_ENV = 'production';

app.use(
  '/',
  express.static(CLIENT_BUILD_DIR, {
    maxAge: '1h',
    extensions: ['html'],
  })
);

app.use(morgan('tiny'));

app.all(
  '*',
  createRequestHandler({
    build: SERVER_BUILD_DIR,
  })
);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});