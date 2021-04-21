import React from 'react';
import authSuccess from '../images/auth-success.svg';
import authFailure from '../images/auth-failure.svg';

function InfoTooltip(props) {
  return (
    <div className={`popup popup_type_auth-result ${props.isOpen ? "popup_open" : ""}`} onClick={props.onClose}>
      <button type="button" aria-label="close-auth-result" className="form__close-tool" onClick={props.onClose}></button>
      <div className="popup__content_infoTool">
        <img
          className="popup__image_auth-result"
          src={props.isSuccess ? authSuccess : authFailure}
          alt={props.isSuccess ? "success-icon" : "failure-icon"}
        />
        <h2 className="form__title">{props.infoMessage}</h2>
      </div>
    </div>
  )
}

export default InfoTooltip;
