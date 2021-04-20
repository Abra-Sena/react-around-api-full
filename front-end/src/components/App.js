/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { Route, Switch, useHistory} from 'react-router-dom'

import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import Register from './Register';
import Login from './Login';
import ProtectedRoute from './ProtectedRoute';
import PopupWithForm from './PopupWithForm';
import AddPlacePopup from './AddNewCardPopup';
import EditAvatarPopup from "./EditAvatarPopup";
import EditProfilePopup from "./EditProfilePopup";
import ImagePopup from './ImagePopup';
import InfoTooltip from './InfoTooltip';
import Api from "../utils/api";
import * as auth from "../utils/auth";
import { CurrentUserContext } from '../contexts/CurrentUserContext';


function App() {
  const [token, setToken] = React.useState(localStorage.getItem("jwt"));
  const history = useHistory();
  const api = new Api({
    baseUrl: "https://api.abravi-api.students.nomoreparties.site",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`
    }
  });

  const [currentUser, setCurrentUser] = React.useState({});
  const [cards, setCards] = React.useState([]);
  const [selectedCard, setSelectedCard] = React.useState({name: "Yosemite", link: "https://code.s3.yandex.net/web-code/yosemite.jpg"});
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  //popupus
  const [isAddNewCard, setAddNewCardPopup] = React.useState(false);
  const [isEditAvatar, setEditAvatarPopup] = React.useState(false);
  const [isEditProfile, setEditProfilePopup] = React.useState(false);
  const [isDeleteCard, setDeleteCardPopup] = React.useState(false);
  const [isImageExpand, setImageExpand] = React.useState(false);
  const [isInfoTooltip, setInfoTooltip] = React.useState(false);


  //Registration
  function handleRegister(email, password) {
    auth.register(email, password)
      .then((res) => {
        if(res.data) {
          setIsSuccess(true);
          toggleToolTip();
          history.push('/');
        }
        else {
          setIsSuccess(false);
          // set state for result popup here
          toggleToolTip();
          return;
        }
      })
      .catch(err => console.log(err));
  }
  //Login
  function handleLogin(email, password) {
    if(!email || !password) return;

    auth.authorize(email, password)
    .then((data) => {
      if (!data) {
        setIsSuccess(false);
        toggleToolTip();
        history.push('/signin'); // needed ???
      }

      toggleToolTip()
      setPassword('');
      setEmail(email);
      setIsSuccess(true);
      setIsLoggedIn(true);
      setToken(localStorage.getItem('jwt'));
      history.push('/');
    })
    .catch(err => console.log(err));
  }
  //Signout
  function handleSignOut() {
    localStorage.removeItem('jwt');
    setToken('');
    setIsLoggedIn(false);
    setEmail('');
    history.push('/signin');
  }

  function toggleToolTip() {
    setInfoTooltip(!isInfoTooltip);
  }

  //handle click on buttons
  function handleEditAvatarBtn() {
    setEditAvatarPopup(true);
  }
  function handleEditProfileBtn() {
    setEditProfilePopup(true);
  }
  function handleAddCardBtn() {
    setAddNewCardPopup(true);
  }
  // function handleDeleteBtn(card) { // not needed yet
  //   setDeleteCardPopup(true);
  // }
  function handleCardClick(card) {
    setSelectedCard(card);
    setImageExpand(true);
  }
  function handleCardLike(card) {
    // Check one more time if this card was already liked
    const isLiked = card.likes.some((i) => i === currentUser._id);
    const res = isLiked ? api.removeCardLike(card.id) : api.addCardLike(card.id);

    res.then((newCard) => {
      // Create a new array based on the existing one and putting a new card into it
      const newCards = cards.map((c) => c.id === card.id ? transformCard(newCard) : c);
      // Update the state
      setCards(newCards);
    }).catch(err => console.log(err));
  }
  function closeAllPopups() {
    setEditAvatarPopup(false);
    setEditProfilePopup(false);
    setAddNewCardPopup(false);
    setDeleteCardPopup(false);
    setImageExpand(false);
    setInfoTooltip(false);
  }

  function handlePopupClose(evt) {
    if(evt.target !== evt.currentTarget) return;

    closeAllPopups();
  }
  function handleCardDelete(card) {
    api.removeCard(card.id)
      .then(() => {
        const cardsCopy = cards.filter((item) => item.id !== card.id);
        setCards(cardsCopy);
      })
      .catch(err => console.log(err));
  }

  // edit avatar and profile
  function handleEditAvatar(avatar) {
    api.setUserAvatar({avatar})
      .then((res) => { setCurrentUser(res) })
      .then(() =>  setEditAvatarPopup(false))
      .catch(err => console.log(err));
  }
  function handleEditProfile({name, about}) {
    api.setUserInfos({name, about})
      .then((user) => { setCurrentUser(user.data) })
      .then(() =>  setEditProfilePopup(false))
      .catch(err => console.log(err));
  }

  //cards
  function transformCard(cardItem) {
    return {
      alt: cardItem.name,
      title: cardItem.name,
      src: cardItem.link,
      id: cardItem._id,
      owner: cardItem.owner,
      likes: cardItem.likes
    }
  }
  function handleAddNewCard({name, link}) {
    api.addCard({name, link})
      .then((newCard) => setCards([transformCard(newCard), ...cards]) )
      .then(() => setAddNewCardPopup(false))
      .catch(err => console.log(err));
  }

  //collect user's informations
  React.useEffect(() => {
    if(token) {
      auth.getContent(token)
        .then((res) => {
          if(res) {
            setIsLoggedIn(true);
            setIsSuccess(true);
            setEmail(res.email);
            history.push('/');
          }
        })
        .catch((err) => console.log(err));

      api.getAppInfo()
        .then(([userInfo, initialCards]) =>{
          setCurrentUser(userInfo.data);
          setCards(
            initialCards.map(transformCard)
          );
        })
        .catch(err => console.log(err));

    }
  }, [token])

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <Switch>
        <Route path='/signup'>
          <Header email={isLoggedIn ? email : ""} link={'/signin'} linkText={"Log in"} />
          <Register email={email} password={password} handleRegister={handleRegister} />
        </Route>

        <Route path='/signin'>
          <Header email={isLoggedIn ? email : ""} link={'/signup'} linkText={"Sign up"} />
          <Login email={email} password={password} handleLogin={handleLogin} />
        </Route>

        <ProtectedRoute exact path='/'
          isLoggedIn={isLoggedIn}
          email={email}
          cards={cards}
          component={Main}
          toggleToolTip={toggleToolTip}
          handleSignOut={handleSignOut}
          handleEditAvatarBtn={handleEditAvatarBtn}
          handleEditProfileBtn={handleEditProfileBtn}
          handleAddCardBtn={handleAddCardBtn}
          handleCardLike={(card) => handleCardLike(card)}
          handleCardDelete={(card) => handleCardDelete(card)}
          handleCardClick={(card) => handleCardClick(card)}
          onCardClick={(card) => handleCardClick(card)}
          onDeleteClick={(card) => handleCardDelete(card)}
          onLikeClick={(card) => handleCardLike(card)}
        />
      </Switch>

      <Footer />

      <InfoTooltip isSuccess={isSuccess} isOpen={isInfoTooltip} onClose={handlePopupClose} />

      {/* Edit avatar popup */}
      <EditAvatarPopup isOpen={isEditAvatar} onClose={handlePopupClose} onUpdateAvatar={handleEditAvatar} />

      {/* Edit Profile popup */}
      <EditProfilePopup isOpen={isEditProfile} onClose={handlePopupClose} onProfileUpdate={handleEditProfile} />

      {/* Add New Card Popup */}
      <AddPlacePopup isOpen={isAddNewCard} onClose={handlePopupClose} handleAddNewCard={handleAddNewCard} />

      {/* Delete card confirmation - not needed yet */}
      <PopupWithForm name="delete" title="Are You Sure?" submitButton="Yes" isOpen={isDeleteCard} onClose={handlePopupClose} onSubmit={handleCardDelete} />

      {/* Expand card on full-screen */}
      <ImagePopup src={selectedCard.src} title={selectedCard.title} isOpen={isImageExpand} onClose={handlePopupClose} />

    </CurrentUserContext.Provider>
  );
}

export default App;
