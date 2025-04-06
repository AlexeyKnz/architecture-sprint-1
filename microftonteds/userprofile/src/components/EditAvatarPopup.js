import React, { Suspense, lazy } from 'react';
import api from '../utils/api';
import { eventBus } from "event-bus";

const PopupWithForm = lazy(() => import('shared_ui/PopupWithForm').catch(() => {
  return { default: () => <div className='error'>Component is not available!</div> };
})
);


function EditAvatarPopup({ isOpen, onClose }) {

  const inputRef = React.useRef();

  function handleSubmit(e)
  {
    e.preventDefault();

    api
    .setUserAvatar({
      avatar: inputRef.current.value,
    })
    .then((newUserData) => {
      eventBus.emit("user-data-update", {data: newUserData });
    })
    .catch((err) => console.log(err));

  }

  return (
    <Suspense fallback>
      <PopupWithForm
        isOpen={isOpen} onSubmit={handleSubmit} onClose={onClose}  title="Обновить аватар" name="edit-avatar"
      >

        <label className="popup__label">
          <input type="url" name="avatar" id="owner-avatar"
                className="popup__input popup__input_type_description" placeholder="Ссылка на изображение"
                required ref={inputRef} />
          <span className="popup__error" id="owner-avatar-error"></span>
        </label>
      </PopupWithForm>
    </Suspense>
  );
}

export default EditAvatarPopup;
