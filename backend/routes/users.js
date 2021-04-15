const express = require('express');
const { celebrate, Joi } = require('celebrate');

const router = express.Router();
const { getOneUser, getUsers, getCurrentUser, updateProfile, updateAvatar } = require('../controllers/userController');

router.get('/', getUsers);
router.get(
  '/:_id',
  celebrate({
    params: Joi.object().keys({
      _id: Joi.string().hex().length(24).required()
    })
  }),
  getOneUser
);
router.get(
  '/me',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email()
    }).unknown(true)
  }),
  getCurrentUser
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
      avatar: Joi.string().required().uri()
    }).unknown(true)
  }),
  updateAvatar
);

module.exports = router;
