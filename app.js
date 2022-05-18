const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const {
  usersRouter,
  contactsRouter,
  publicRouter,
} = require('./src/routes/api');

const CORS = process.env.CORS ?? '*';

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(express.json());
app.use(cors({ origin: CORS }));
app.use(morgan(formatsLogger));

app.use(express.static('public'));

app.use('/api/contacts', contactsRouter);
app.use('/api/users', usersRouter);
app.use('/public', publicRouter);

app.use((req, res) => {
  res.status(404).send({ message: 'Page Not found' });
});

app.use((err, req, res, next) => {
  const statusCode = err.status ?? 500;
  res.status(statusCode).send({ message: err.message });
});

module.exports = app;
