import React from 'react';
import Header from './Header';
import Card from './Card';
import { CurrentUserContext } from '../contexts/CurrentUserContext';


function Main(props) {
  const currentUser = React.useContext(CurrentUserContext);

  return(
    <main className="content">
      <Header email={props.isLoggedIn ? currentUser.email : ""} link={'/'} linkText={props.isLoggedIn ? "Log out" : ""} onClick={props.handleSignOut} />

      <section className="profile">
        <div className="profile__avatar">
          <img src={currentUser.avatar} alt="profile-pic" className="profile__photo" />
          <button type="button" aria-label="edit-avatar" className="profile__photo_edit" onClick={props.handleEditAvatarBtn}></button>
        </div>
        <div className="profile__info">
          <div className="profile__title">
            <h1 className="profile__name">{currentUser.name}</h1>
            <button type="button" aria-label="edit-profile" className="profile__edit" onClick={props.handleEditProfileBtn}></button>
          </div>
          <p className="profile__description">{currentUser.about}</p>
        </div>
        <button aria-label="add-card-button" className="add-button" onClick={props.handleAddCardBtn}></button>
      </section>

      <section className="elements">
        <ul className="elements__list">
          {
            props.cards.map((card, id) =>
              <Card
                key={id}
                card={card}
                alt={card.alt}
                src={card.src}
                title={card.title}
                likes={card.likes}
                owner={card.owner}
                onCardClick={() => props.handleCardClick(card)}
                onDeleteClick={(card) => props.handleCardDelete(card)}
                onLikeClick={(card) => props.handleCardLike(card)}
              />
            )
          }
        </ul>
      </section>
    </main>
  )
}


export default Main;

