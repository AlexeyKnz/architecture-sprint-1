import React from 'react';

import { useHistory } from "react-router-dom";
import { eventBus } from "event-bus";
import api from '../utils/api';
import '../styles//login.css';
import '../styles/auth-form/auth-form.css';
import InfoTooltip from './InfoTooltip';

function UserAuth (){
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isInfoToolTipOpen, setIsInfoToolTipOpen] = React.useState(false);
  const [tooltipStatus, setTooltipStatus] = React.useState("");

  const history = useHistory();

  function onLogin({ email, password }) {
      api
        .login(email, password)
        .then((res) => {
          eventBus.emit("user-auth-success", {email: email });
          history.push("/");
        })
        .catch((err) =>
        {
          setIsInfoToolTipOpen(true);
          setTooltipStatus("fail");
          console.log(err);
        });
    }

  function closeAllPopups()
  {
    setIsInfoToolTipOpen(false);
  }

  function handleSubmit(e){
    e.preventDefault();
    const userData = {
      email,
      password
    }
    onLogin(userData);
  }
  return (
    <div className="auth-form">
      <form className="auth-form__form" onSubmit={handleSubmit}>
        <div className="auth-form__wrapper">
          <h3 className="auth-form__title">Вход</h3>
          <label className="auth-form__input">
            <input type="text" name="name" id="email"
              className="auth-form__textfield" placeholder="Email"
              onChange={e => setEmail(e.target.value)} required  />
          </label>
          <label className="auth-form__input">
            <input type="password" name="password" id="password"
              className="auth-form__textfield" placeholder="Пароль"
              onChange={e => setPassword(e.target.value)} required  />
          </label>
        </div>
        <button className="auth-form__button" type="submit">Войти</button>
      </form>
      <InfoTooltip
              isOpen={isInfoToolTipOpen}
              status={tooltipStatus}
              onClose={closeAllPopups}
      />
    </div>
  )
}

export default UserAuth;