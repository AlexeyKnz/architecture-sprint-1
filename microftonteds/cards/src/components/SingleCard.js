import React from 'react';
import { CurrentUserContext } from 'user-context';
import { eventBus } from "event-bus";
import api from '../utils/api';

function SingleCard({ card}) {
  const cardStyle = { backgroundImage: `url(${card.link})` };

  function handleClick() {
    eventBus.emit("card-clicked", {card: card });
  }

  function handleLikeClick() {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        eventBus.emit("card-like-count-upd", {newCard: newCard });
      })
      .catch((err) => console.log(err));
  }

  function handleDeleteClick() {
    api
      .removeCard(card._id)
      .then(() => {
        eventBus.emit("card-deleted", {card: card });
      })
      .catch((err) => console.log(err));
  }

  const currentUser = React.useContext(CurrentUserContext);

  const isLiked = card.likes.some(i => i._id === currentUser._id);
  const cardLikeButtonClassName = `card__like-button ${isLiked && 'card__like-button_is-active'}`;

  const isOwn = card.owner._id === currentUser._id;
  const cardDeleteButtonClassName = (
    `card__delete-button ${isOwn ? 'card__delete-button_visible' : 'card__delete-button_hidden'}`
  );

  return (
    <li className="places__item card">
      <div className="card__image" style={cardStyle} onClick={handleClick}>
      </div>
      <button type="button" className={cardDeleteButtonClassName} onClick={handleDeleteClick}></button>
      <div className="card__description">
        <h2 className="card__title">
          {card.name}
        </h2>
        <div className="card__likes">
          <button type="button" className={cardLikeButtonClassName} onClick={handleLikeClick}></button>
          <p className="card__like-count">{card.likes.length}</p>
        </div>
      </div>
    </li>
  );
}

export default SingleCard;
