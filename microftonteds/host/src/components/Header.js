import React from 'react';
import { Route, Link } from 'react-router-dom';
import logoPath from '../assets/images/logo.svg';
import { useHistory } from "react-router-dom";

// В корневом компоненте App описаны обработчики: onRegister, onLogin и onSignOut. Эти обработчики переданы в соответствующие компоненты: Register.js, Login.js, Header.js
function Header ({email})
{

  const history = useHistory();

  function handleSignOut()
  {
    localStorage.removeItem("jwt");
    history.push("/UserAuth");
  }

  return (
    <header className="header page__section">
      <img src={logoPath} alt="Логотип проекта Mesto" className="logo header__logo" />
      <Route exact path="/">
        <div className="header__wrapper">
          <p className="header__user">{email}</p>
          <button className="header__logout" onClick={handleSignOut}>Выйти</button>
        </div>
      </Route>
      <Route path="/UserRegister">
        <Link className="header__auth-link" to="/UserAuth">Войти</Link>
      </Route>
      <Route path="/UserAuth">
        <Link className="header__auth-link" to="/UserRegister">Регистрация</Link>
      </Route>
    </header>
  )
}

export default Header;
