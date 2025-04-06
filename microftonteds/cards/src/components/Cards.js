import React from 'react';
import api from '../utils/api';
import { eventBus } from "event-bus";
import SingleCard from './SingleCard';
import '../styles/card/card.css'
import '../styles/places/places.css'
import ImagePopup from './ImagePopup';
import AddPlacePopup from './AddPlacePopup';

function Cards() {

    const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
    const [selectedCard, setSelectedCard] = React.useState(null);
    const [cards, setCards] = React.useState([]);

    function CloseCard()
    {
        setSelectedCard(null);
    }

    function CloseAddCardPopup()
    {
        setIsAddPlacePopupOpen(false);
    }

    function handleAddPlaceSubmit(newCard) {
        api.addCard(newCard)
        .then((newCardFull) => {
        setCards([newCardFull, ...cards]);
        setIsAddPlacePopupOpen(false);
        })
        .catch((err) => console.log(err));
    }

    React.useEffect(() => {
        api.getCardList()
          .then((cardData) => {
            setCards(cardData);
          })
          .catch((err) => console.log(err));

        const handleLikeCountUpd = (Data) => {
            setCards((cards) =>
                cards.map((c) => (c._id === Data.newCard._id ? Data.newCard : c))
              );
        };

        const handleCardClicked = (Data) => {
            setSelectedCard(Data.card);
        };

        const handleAddCard = () => {
            setIsAddPlacePopupOpen(true);
        };

        const handleCardDeleted = (Data) => {
            setCards((cards) => cards.filter((c) => c._id !== Data.card._id));
        };

        eventBus.on("card-like-count-upd", handleLikeCountUpd);
        eventBus.on("card-clicked", handleCardClicked);
        eventBus.on("card-deleted", handleCardDeleted);
        eventBus.on("user-add-card", handleAddCard);

        return () => {
            eventBus.off("card-like-count-upd", handleLikeCountUpd);
            eventBus.off("card-clicked", handleCardClicked);
            eventBus.off("card-deleted", handleCardDeleted);
            eventBus.off("user-add-card", handleAddCard);
        };
      }, []);


  return (
        <section className="places page__section">
            <ul className="places__list">
            {cards.map((card) => (
                <SingleCard
                    key={card._id}
                    card={card}
                />
            ))}
            </ul>
            <ImagePopup card={selectedCard} onClose={CloseCard}/>
            <AddPlacePopup
                isOpen={isAddPlacePopupOpen}
                onAddPlace={handleAddPlaceSubmit}
                onClose={CloseAddCardPopup}
            />
        </section>
  );
}

export default Cards;