const express = require('express');
const { celebrate, Joi } = require('celebrate');

const router = express.Router();
const { getOneUser, getUsers, getCurrentUser, updateProfile, updateAvatar } = require('../controllers/userController');

router.get('/users', getUsers);
router.get(
  '/users/:_id',
  celebrate({
    body: Joi.object().keys({
      _id: Joi.string().hex().length(24).required()
    }).unknown(true)
  }),
  getOneUser
);
router.get(
  '/users/me',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email()
    }).unknown(true)
  }),
  getCurrentUser
);
router.patch(
  '/users/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30)
    }).unknown(true)
  }),
  updateProfile
);
router.patch(
  '/users/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().required().uri()
    }).unknown(true)
  }),
  updateAvatar
);

module.exports = router;
