const express = require('express');
const { celebrate, Joi } = require('celebrate');

const router = express.Router();
const { getOneUser, getUsers, getCurrentUser, updateProfile, updateAvatar } = require('../controllers/userController');

router.get('/users', getUsers);

router.get('/users/me', getCurrentUser);

router.get(
  '/users/:id',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().hex().length(24)
    })
  }),
  getOneUser
);

router.patch(
  '/users/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30)
    })
  }),
  updateProfile
);

router.patch(
  '/users/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().uri().required()
    })
  }),
  updateAvatar
);

module.exports = router;
