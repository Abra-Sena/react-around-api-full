/* eslint-disable prefer-template */
// eslint-disable-next-line import/no-extraneous-dependencies
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const { celebrate, Joi, errors } = require('celebrate');

const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const auth = require('./middleware/auth');
const { requestLogger, errorLogger } = require('./middleware/logger');
const { login, createUser } = require('./controllers/userController');

const NotFounded = require('./middleware/errors/NotFounded');

const app = express();
const { PORT = 3000, BASE_PATH } = process.env;

mongoose.connect('mongodb://localhost:27017/aroundb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

app.use(helmet());

app.use((req, res, next) => {
  // res.header('Access-Control-Allow-Origin', 'https://around.nomoreparties.co');
  res.header('Access-Control-Allow-Headers', 'Origin, X-requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, HEAD, PUT, PATCH, POST DELETE');

  next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors()); //enable all cors requests
app.options('*', cors()); //enable pre-flightimg

app.use(requestLogger);

//to handle testing server crash - to be removed once project passed the review
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server will crash now');
  }, 0);
});

app.post(
  '/signup',
  // celebrate({
  //   body: Joi.string.object.keys({
  //     name: Joi.string().min(2).max(30),
  //     about: Joi.string().min(2).max(30),
  //     email: Joi.string().required().email(),
  //     password: Joi.string().required(),
  //     avatar: Joi.string()
  //   })
  // }),
  createUser
);
app.post(
  '/signin',
  // celebrate({
  //   body: Joi.object().keys({
  //     email: Joi.string().required().email(),
  //     password: Joi.string().required()
  //   })
  // }),
  login
);

// connecting routes
app.use(auth);
app.use('/users', userRouter);
app.use('/cards', cardRouter);

//errors handling
app.get('*', (req, res) => {
  throw new NotFounded('Requested resource not found');
});

//enabling error logger
app.use(errorLogger);
//celebrate error handler
app.use(errors());
//centralized error handler
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500 ? 'An error occured on the server' : message
  });

  next();
});

app.listen(PORT, () => {
  console.log(`Server started\nApp listening at port ${PORT}`);
  console.log('URL: ', BASE_PATH);
});
