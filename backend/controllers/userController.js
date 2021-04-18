/* eslint-disable import/no-unresolved */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const BadRequest = require('../middleware/errors/BadRequest');
const NotFounded = require('../middleware/errors/NotFounded');
const UnAuthorized = require('../middleware/errors/UnAuthorized');

const { NODE_ENV, JWT_SECRET } = process.env;

function getUsers(req, res, next) {
  return User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch(next);
}

function getOneUser(req, res, next) {
  return User.findById(req.params.id === 'me' ? req.user._id : req.params.id)
    .then((user) => {
      if (!user) {
        throw new NotFounded('User ID not found');
      }
      return res.status(200).send(user);
    })
    .catch(next);
}

function createUser(req, res, next) {
  const { email, password, name, about, avatar } = req.body;
  //check email andd password validity
  if(!email || !password) {
    throw new BadRequest('Please enter a valid email or password');
  }

  //hash password before saving to database
  return bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({ email, password: hash, name, about, avatar })
        .then((user) => {
          if(!user) throw new BadRequest('Invalid Data!');

          res.status(201).send({
            _id: user._id,
            email: user.email,
            name: user.name,
            about: user.about,
            avatar: user.avatar
          });
        })
        .catch(next);
    });
}

function login(req, res, next) {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        throw new NotFounded('This User does not exist!');
      }

      const token = jwt.sign(
        {
          _id: user._id
        },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        {
          expiresIn: '7d'
        }
      );

      res.send({ token });
    })
    .catch(() => {
      if(res.status(401)) {
        throw new UnAuthorized('Incorrect email or password');
      }
    });
    // .catch(next);
}

function getCurrentUser(req, res, next) {
  User.findById(req.user._id)
    .then((user) => {
      if(!user) throw new NotFounded('Current User not found!');

      res.send({ data: user});
    })
    .catch(next);
}

function updateProfile(req, res, next) {
  console.log(req.body);
  return User.findByIdAndUpdate(
      req.user._id,
      {
        name: req.body.name,
        about: req.body.about
      },
      {
        new: true,
        runValidators: true
      }
    )
    .then((profile) => {
      if(!profile) throw new NotFounded('Profile Update: Not a valid profile ID');

      return res.status(200).send({ data: profile });
    })
    .catch(next);
}

function updateAvatar(req, res, next) {
  return User.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar }, { new: true, runValidators: true })
    .then((userAvatar) => {
      if(!userAvatar) throw new NotFounded('Avatar Update: Not a valid profile ID');

      return res.status(200).send({data: userAvatar});
    })
    .catch(next);
}

module.exports = {
  getUsers,
  getOneUser,
  createUser,
  login,
  getCurrentUser,
  updateProfile,
  updateAvatar,
};
