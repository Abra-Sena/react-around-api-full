import React from 'react';

function PopupWithForm(props) {
  return (
    <div className={`popup popup_type_${props.name} ${props.isOpen ? "popup_open" : ""}`} onClick={props.onClose}>
      <form
        action="#"
        id={props.name}
        name={props.name}
        onSubmit={props.onSubmit}
        className={`form popup__form form_${props.name}`}
        noValidate
      >
        <h2 className="form__title">{props.title}</h2>
        <fieldset className="form__field">
          {props.children}
        </fieldset>
        <button type="submit" aria-label="save-edit-avatar" className={props.submitButtonClassName}>{props.submitButton}</button>
        <button type="button" aria-label="close-edit-avatar" className="popup__close form__close-button" onClick={props.onClose}></button>
      </form>
    </div>
  )
}

export default PopupWithForm;

