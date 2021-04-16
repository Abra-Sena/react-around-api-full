const express = require('express');
const { celebrate, Joi } = require('celebrate');
const { getCards, createCard, deleteCard, likeCard, unLikeCard } = require('../controllers/cardsController');

const router = express.Router();

router.get('/cards', getCards);
router.post(
  '/cards',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().uri().required()
    })
  }),
  createCard
);
router.delete(
  '/cards/:cardId',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().hex().length(24).required()
    })
  }),
  deleteCard
);
router.put(
  '/cards/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().hex().length(24).required()
    })
  }),
  likeCard
);
router.delete(
  '/cards/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().hex().length(24).required()
    })
  }),
  unLikeCard
);

module.exports = router;
