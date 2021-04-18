import React from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';


function Card(props) {
  // current user context
  const currentUser = React.useContext(CurrentUserContext);
  // Checking if current user is the owner of the current card
  const isOwn = props.owner === currentUser._id;
  //variable for delete button class name
  const cardDeleteButtonClassName = (`element__delete ${isOwn ? 'element__delete_show' : 'element__delete_hidden'}`);
  // Check if the card was liked by the current user
  const isLiked = props.card.likes.some((i) => i === currentUser._id);
  // Create a variable which you then set in `className` for the like button
  const cardLikeButtonClassName = (`element__like ${isLiked ? 'element__like_active' : 'element__like'}`);

  function handleClick() {
    props.onCardClick(props.card)
  }

  function handleLike() {
    props.onLikeClick(props.card)
  }

  function handleDelete() {
    props.onDeleteClick(props.card)
  }

  return (
    <li className="element__item">
      <button type="button" aria-label="delete-card" className={cardDeleteButtonClassName} onClick={handleDelete}></button>
      <img className="element__photo" src={props.src} alt={props.alt} onClick={handleClick} />
      <div className="element__details">
        <h2 className="element__name">{props.title}</h2>
        <div className="element__likes">
          <button type="button" aria-label="like-card" className={cardLikeButtonClassName} onClick={handleLike}></button>
          <p className="element__like_count">{props.likes.length}</p>
        </div>
      </div>
    </li>
  )
}

export default Card;
