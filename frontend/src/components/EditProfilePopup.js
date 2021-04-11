import React from 'react';
// import FormValidator from "./FormValidator";
import PopupWithForm from './PopupWithForm';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
// import { defaultSettings } from "../utils/constants";


function EditProfilePopup(props) {
  const [name, setName] = React.useState("");
  const [about, setAbout] = React.useState("");
  const currentUser = React.useContext(CurrentUserContext);
  // const editFormValidator = new FormValidator(defaultSettings, '.form_edit-profile');

  function handleNameChange(evt) {
    setName(evt.target.value);
  }

  function handleAboutChange(evt) {
    setAbout(evt.target.value);
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    //validate edit profile
    // editFormValidator.enableValidation();
    props.onProfileUpdate({name, about});
  }

  // copy user data into popup form on open
  React.useEffect(() => {
    setName(currentUser.name || '');
    setAbout(currentUser.about || '');
  }, [currentUser]);


  return (
    <PopupWithForm
      name="edit-profile"
      title="Edit Profile"
      submitButton="Save"
      submitButtonClassName="form__submit"
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmit}
    >
      <input id="profile-name" type="text" name="name" className="form__input form__input_type_name" placeholder="Name" minLength="2" maxLength="30" value={name} onChange={handleNameChange} required />
      <span id="profile-name-error" className="form__field form__field_error"></span>
      <input id="profile-description" type="text" name="about" className="form__input form__input_type_description" placeholder="About Me" minLength="2" maxLength="200" value={about} onChange={handleAboutChange} required />
      <span id="profile-description-error" className="form__field form__field_error"></span>
    </PopupWithForm>
  )
}
export default EditProfilePopup;

