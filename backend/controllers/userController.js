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
    // .catch((err) => res.status(500).send({ message: err }))
    .catch(next);
}

function getOneUser(req, res, next) {
  return User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        throw new NotFounded('User ID not found');
      }
      return res.status(200).send(user);
    })
    // .catch((err) => {
    //   if(err.name === 'CastError') {
    //     res.status(400).send({ message: err.message });
    //   }
    //   res.status(500).send({ message: err });
    // })
    .catch(next);
}

function createUser(req, res) {
  const { name, about, email, password, avatar } = req.body;
  //check email andd password validity
  if(!email || !password) {
    throw new BadRequest('Please enter a valid email or password');
  }

  //hash password before saving to database
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name: req.body.name,
      about: req.body.about,
      email: req.body.email,
      password: hash,
      avatar: req.body.avatar
    }))
    .then((user) => {
      if(!user) throw new BadRequest('Invalid Data!');

      res.status(200).send({
        _id: user._id,
        email: user.email,
        name: user.name,
        about: user.about,
        avatar: user.avatar
      });
    })
    .catch((err) => {
      if(err.name === 'MongoError' && err.code === 11000) {
        res.status(409).send({ message: 'This User already exist!' });
      }
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
      if(!user) throw new NotFounded('User not found!');

      res.send({ data: user});
    })
    .catch(next);
}

function updateProfile(req, res, next) {
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
      if(!profile) throw new NotFounded('Not a valid profile ID');

      return res.status(200).send({ data: profile });
    })
    // .catch((err) => res.status(500).send({ message: 'User profile cannot be patched', err }))
    .catch(next);
}

function updateAvatar(req, res, next) {
  return User.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar }, { new: true, runValidators: true })
    .then((userAvatar) => {
      if(!userAvatar) throw new NotFounded('Not a valid profile ID');

      return res.status(200).send({data: userAvatar});
    })
    // .catch((err) => res.status(500).send({ message: 'User avatar cannot be patched', err }))
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
