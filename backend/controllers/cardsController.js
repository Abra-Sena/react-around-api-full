const Card = require('../models/cards');
const BadRequest = require('../middleware/errors/BadRequest');
const NotFounded = require('../middleware/errors/NotFounded');
const UnAuthorized = require('../middleware/errors/UnAuthorized');

function getCards(req, res, next) {
  return Card.find({})
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch(next);
}

function createCard(req, res, next) {
  const { name, link } = req.body;

  return Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      if (!card) {
        throw new BadRequest('Invalid Data for Card Creation!');
      }

      res.status(201).send(card);
    })
    .catch(next);
}

function deleteCard(req, res, next) {
  return Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFounded('No card with such ID');
      } else if(!card.owner._id === req.user._id) {
        throw new UnAuthorized('Forbidden! You are not the owner.');
      } else {
        return res.status(200).send({ data: card });
      }
    })
    .catch(next);
}

function likeCard(req, res, next) {
  return Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((likeId) => {
      if (likeId === null) throw new NotFounded('No card with such ID');

      return res.status(200).send({ data: likeId });
    })
    .catch(next);
    // .catch((err) => res.status(500).send({ message: 'Card can not be liked', err }));
}

function unLikeCard(req, res, next) {
  return Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((unLikeId) => {
      if (unLikeId === null) throw new NotFounded('No card with such ID');

      return res.status(200).send({ data: unLikeId });
    })
    .catch(next);
    // .catch((err) => res.status(500).send({ message: 'Card cannot be unLiked', err }));
}

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  unLikeCard,
};
