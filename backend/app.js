/* eslint-disable prefer-template */
// eslint-disable-next-line import/no-extraneous-dependencies
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
const { PORT = 3000 } = process.env;

app.use(cors()); //enable all cors requests
app.options('*', cors()); //enable pre-flightimg
app.use(requestLogger);
app.use(express.json());
app.use(helmet());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/aroundb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required()
    })
  }),
  createUser
);

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required()
    })
  }),
  login
);

// connecting routes
// app.use(auth);
app.use('/', userRouter);
app.use('/', cardRouter);

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

// app.use((req, res, next) => {
//   // res.header('Access-Control-Allow-Origin', 'https://around.nomoreparties.co');
//   res.header('Access-Control-Allow-Headers', 'Origin, X-requested-With, Content-Type, Accept');
//   res.header('Access-Control-Allow-Methods', 'GET, HEAD, PUT, PATCH, POST DELETE');

//   next();
// });
