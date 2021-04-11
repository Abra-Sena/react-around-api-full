//import user's model
const Card = require('../models/cards');

function getCards(req, res) {
  return Card.find({})
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch((err) => res.status(500).send({ message: err }));
}

function createCard(req, res) {
  const { name, link } = req.body;

  return Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if(err.name === 'ValidationError') {
        res.status(400).send({ message: err.message });
      }
      res.status(500).send({ message: err });
    });
}

function deleteCard(req, res) {
  return Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'No card with such id' });
      }
      return res.send({ data: card });
    })
    .catch((err) => res.status(500).send({ message: 'Card cannot be deleted', err }));
}

function likeCard(req, res) {
  return Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((likeId) => {
      if (likeId === null) {
        return res.status(404).send({ message: 'No card with such id' });
      }
      return res.send({ data: likeId });
    })
    .catch((err) => res.status(500).send({ message: 'Card can not be liked', err }));
}

function unLikeCard(req, res) {
  return Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((unLikeId) => {
      if (unLikeId === null) {
        return res.status(404).send({ message: 'No card with such id' });
      }
      return res.send({ data: unLikeId });
    })
    .catch((err) => res.status(500).send({ message: 'Card cannot be unLiked', err }));
}

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  unLikeCard,
};
