const express = require('express');
const { celebrate, Joi } = require('celebrate');

const router = express.Router();
const { getOneUser, getUsers, getCurrentUser, updateProfile, updateAvatar } = require('../controllers/userController');

router.get('/', getUsers);

router.get('/me', getCurrentUser);

router.get(
  '/:id',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().hex().length(24)
    }).unknown(true)
  }),
  getOneUser
);

router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30)
    }).unknown(true)
  }),
  updateProfile
);

router.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().uri().required()
    }).unknown(true)
  }),
  updateAvatar
);

module.exports = router;
