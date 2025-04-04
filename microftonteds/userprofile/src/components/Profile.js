import React from 'react';
import api from '../utils/api';
import '../styles/profile/profile.css'
import { eventBus } from "event-bus";
import EditAvatarPopup from './EditAvatarPopup';
import EditProfilePopup from './EditProfilePopup';

function Profile() {
  const [currentUser, setCurrentUser] = React.useState({});
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);

  const closeAllPopups = () => { 
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    };

    const HandleEditAvatar = () => { 
        setIsEditAvatarPopupOpen(true);
        };

    const HandleEditprofile = () => { 
        setIsEditProfilePopupOpen(true);
        };

  React.useEffect(() => {
    const handleUserDataUpdate = (userData) => {
        setCurrentUser(userData.data);
        closeAllPopups();
    };

      eventBus.on("user-data-update", handleUserDataUpdate);

      api.getUserInfo()
          .then((userData) => {
              setCurrentUser(userData);
              eventBus.emit("user-data-update", { data: userData });
          })
          .catch((err) => console.log(err));

      return () => {
          eventBus.off("user-data-update", handleUserDataUpdate);
      };
  }, []);

  function CallAddCard()
  {
    eventBus.emit("user-add-card", {});
  }

  return (
    <div>
        <section className="profile page__section">
              <div
                  className="profile__image"
                  onClick={HandleEditAvatar}
                  style={{ backgroundImage: `url(${currentUser.avatar || ''})` }}
              />
              <div className="profile__info">
                  <h1 className="profile__title">{currentUser.name || ''}</h1>
                  <button className="profile__edit-button" onClick={HandleEditprofile} type="button" />
                  <p className="profile__description">{currentUser.about || ''}</p>
              </div>
              <button className="profile__add-button" type="button" onClick={CallAddCard}></button>
          </section>
            <EditAvatarPopup
                isOpen={isEditAvatarPopupOpen}
            />
            <EditProfilePopup
                isOpen={isEditProfilePopupOpen}
                currentUser={currentUser}
            />
    </div>
  );
}

export default Profile;