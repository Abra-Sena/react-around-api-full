/* eslint-disable prefer-template */
// eslint-disable-next-line import/no-extraneous-dependencies
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const { celebrate, Joi, errors, Segments } = require('celebrate');

const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const auth = require('./middleware/auth');
const { requestLogger, errorLogger } = require('./middleware/logger');
const { login, createUser } = require('./controllers/userController');

const NotFounded = require('./middleware/errors/NotFounded');

const app = express();
const { PORT = 3000 } = process.env;

app.use(cors()); //enable all cors requests
app.options('*', cors()); //enable pre-flightimg
app.use(requestLogger);
app.use(express.json());
app.use(helmet());

mongoose.connect('mongodb://localhost:27017/aroundb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required()
    }).unknown(true)
  }),
  createUser
);

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required()
    }).unknown(true)
  }),
  login
);

// connecting routes
app.use(auth);
app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.get('*', (req, res, next) => {
  next(new NotFounded('Requested resource not found'));
});

//to handle testing server crash - to be removed once project passed the review
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server will crash now');
  }, 0);
});

//errors handling
app.use(errorLogger); //enabling error logger
app.use(errors()); //celebrate error handler
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
});
