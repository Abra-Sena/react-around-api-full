import React from 'react';
// import { defaultSettings } from "../utils/constants";
// import FormValidator from "./FormValidator";
import PopupWithForm from './PopupWithForm';


function AddPlacePopup(props) {
  const [cardTitle, setCardTitle] = React.useState("");
  const [cardLink, setCardLink] = React.useState("");
  // const addCardValidator = new FormValidator(defaultSettings, '.form_add-card');

  function handleCardTitle(evt) {
    setCardTitle(evt.target.value);
  }

  function handleCardLink(evt) {
    setCardLink(evt.target.value);
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    //validate add new card
    // addCardValidator.enableValidation();
    props.handleAddNewCard({
      name: cardTitle,
      link: cardLink
    });
  }

  return (
    <PopupWithForm
      name="add-card"
      title="New Place"
      submitButton="Save"
      submitButtonClassName="form__submit"
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmit}
    >
      <input id="card-title" type="text" name="name" className="form__input form__input_type_card-title" placeholder="Title" minLength="2" maxLength="30" value={cardTitle} onChange={handleCardTitle} required />
      <span id="card-title-error" className="form__field form__field_error"></span>
      <input id="card-url" type="url" name="link" className="form__input form__input_type_card-url" placeholder="Image link" value={cardLink} onChange={handleCardLink} required />
      <span id="card-url-error" className="form__field form__field_error"></span>
    </PopupWithForm>
  )
}

export default AddPlacePopup;
