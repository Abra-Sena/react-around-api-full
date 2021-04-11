import React from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import PopupWithForm from './PopupWithForm';
// import FormValidator from "./FormValidator";
// import { defaultSettings } from "../utils/constants";

function EditAvatarPopup(props) {
  const avatarRefs = React.useRef();
  const currentUser = React.useContext(CurrentUserContext);
  const [avatar, setAvatar] = React.useState("");
  // const editAvatarValidator = new FormValidator(defaultSettings, '.form_edit-avatar');

  function handleSubmit(evt) {
    evt.preventDefault();
    //validate edit avatar
    // editAvatarValidator.enableValidation();
    props.onUpdateAvatar(avatarRefs.current.value);
    // avatarRefs.current.value ='';
  }

  React.useEffect(() => {
    setAvatar(currentUser.avatar || "");
  }, [currentUser]);

  return (
    <PopupWithForm
      name="edit-avatar"
      title="Change Profile Picture"
      submitButton="Save"
      submitButtonClassName="form__submit"
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmit}
    >
      <input ref={avatarRefs} id="avatar-url" type="url" name="link" value={avatar} onChange={() => setAvatar(avatarRefs.current.value)} className="form__input form__input_type_avatar-url" placeholder="Avatar link" required />
      <span id="avatar-url-error" className="form__field form__field_error"></span>
    </PopupWithForm>
  )
}

export default EditAvatarPopup;
