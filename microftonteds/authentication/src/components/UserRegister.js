import React from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { useHistory } from "react-router-dom";
import '../styles/auth-form/auth-form.css';

function Register ({ onRegister }){
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const history = useHistory();

  function onRegister({ email, password }) {
      api
        .register(email, password)
        .then((res) => {
          console.log(res);
          history.push("/UserAuth");
        })
        .catch((err) => {
          console.log("error");

        });
    }

  function handleSubmit(e){
    e.preventDefault();
    const userData = {
      email,
      password
    }
    onRegister(userData);
  }
  return (
    <div className="auth-form">
      <form className="auth-form__form" onSubmit={handleSubmit}>
        <div className="auth-form__wrapper">
          <h3 className="auth-form__title">Регистрация</h3>
          <label className="auth-form__input">
            <input type="text" name="email" id="email"
              className="auth-form__textfield" placeholder="Email"
              onChange={e => setEmail(e.target.value)} required  />
          </label>
          <label className="auth-form__input">
            <input type="password" name="password" id="password"
              className="auth-form__textfield" placeholder="Пароль"
              onChange={e => setPassword(e.target.value)} required  />
          </label>
        </div>
        <div className="auth-form__wrapper">
          <button className="auth-form__button" type="submit">Зарегистрироваться</button>
          <p className="auth-form__text">Уже зарегистрированы? <Link className="auth-form__link" to="/signin">Войти</Link></p>
        </div>
      </form>
    </div>
  )
}

export default Register;
