class Api {
  constructor({ address }) {
      this._address = address;
  }

  getResponse = (res) => {
    return res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`);
  }

  register = (email, password) => {
    return fetch(`${this._address}/signup`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({email, password})
    })
    .then(this.getResponse)
  };

  login = (email, password) => {
    return fetch(`${this._address}/signin`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({email, password})
    })
    .then(this.getResponse)
    .then((data) => {
      localStorage.setItem('jwt', data.token)
      return data;
    })
  };

  checkToken = (token) => {
    return fetch(`${this._address}/users/me`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    })
    .then(this.getResponse)
  }
}

const api = new Api({
  address: 'https://auth.nomoreparties.co',
});

export default api;