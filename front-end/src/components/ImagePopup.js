import React from 'react';

function ImagePopup(card) {
  return (
    <div className={`popup popup_type_image ${card.isOpen ? "popup_open" : ""}`} onClick={card.onClose}>
      <div className="popup__content">
        <button type="button" aria-label="close-expand-card" className="popup__close" onClick={card.onClose}></button>
        <figure className="popup__figure">
          <img  className="popup__image" src={card.src} alt={card.title} />
          <figcaption className="popup__image-caption">{card.title}</figcaption>
        </figure>
      </div>
    </div>
  )
}

export default ImagePopup;
