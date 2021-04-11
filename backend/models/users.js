/* eslint-disable import/no-unresolved */
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    default: 'Jacques Cousteau'
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    default: 'Explorer'
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v, {
        require_tld: true,
        allow_utf8_local_part: false
      }),
      message: 'You must provide a valid email'
    }
  },
  password: {
    type: String,
    required: true,
    select: false, //this stop API from returning the hash
    minlength: 8
  },
  avatar: {
    type: String,
    required: true,
    default: 'https://i.imgur.com/jCEMu8X.jpg',
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'You must provide a valid URL for the user avatar'
    },
  }
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email }).elect('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Incorrect emial or password'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Incorrect email or password'));
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
