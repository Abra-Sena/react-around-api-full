class Api {
  constructor({baseUrl, headers}) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  _checkResult(res) {
    return (res.ok ? res.json() : Promise.reject('Error!' + res.statusText));
  }

  /**
   * Loading Cards from the Server
   * GET https://around.nomoreparties.co/v1/groupId/cards
   */
  getInitialCards() {
    return fetch(this._baseUrl + '/cards', {
      headers: this._headers
    })
    .then(res => this._checkResult(res))
  }

   /**
   * Loading User Information from the Server
   * GET https://around.nomoreparties.co/v1/groupId/users/me
   */
  getUserInfo() {
    return fetch(this._baseUrl + '/users/me', {
      headers: this._headers
    })
    .then(res => this._checkResult(res))
  }


  /**
   * Get all cards and user infos and only then render them
   */
  getAppInfo() {
    return Promise.all([this.getUserInfo(), this.getInitialCards()]);
  }

  /**
   * Adding a New Card
   * POST https://around.nomoreparties.co/v1/groupId/cards
   */
  addCard({name, link}) {
    return fetch(this._baseUrl + '/cards', {
      headers: this._headers,
      method: "POST",
      body: JSON.stringify({
        name,
        link
      })
    })
    .then(res => this._checkResult(res))
  }

   /**
    * Deleting a Card
    * DELETE https://around.nomoreparties.co/v1/groupId/cards/cardId
    */
  removeCard(cardId) {
    return fetch(this._baseUrl + '/cards/' + cardId, {
      headers: this._headers,
      method: "DELETE"
    })
    .then(res => this._checkResult(res))
  }

  //Adding and Removing Likes
  /** PUT https://around.nomoreparties.co/v1/groupId/cards/likes/cardId */
  addCardLike(cardId) {
    return fetch(this._baseUrl + '/cards/likes/' + cardId, {
      headers: this._headers,
      method: "PUT"
    })
    .then(res =>this._checkResult(res))
  }

  /** DELETE https://around.nomoreparties.co/v1/groupId/cards/likes/cardId */
  removeCardLike(cardId) {
    return fetch(this._baseUrl + '/cards/likes/' + cardId, {
      headers: this._headers,
      method: "DELETE"
    })
    .then(res => this._checkResult(res))
  }

   /**
    * Updating Profile Picture
    * PATCH https://around.nomoreparties.co/v1/groupId/users/me/avatar
    */
  setUserAvatar({avatar}) {
    return fetch(this._baseUrl + '/users/me/avatar', {
      headers: this._headers,
      method: "PATCH",
      body: JSON.stringify({
        avatar
      })
    })
    .then(res => this._checkResult(res))
  }

  /**
   * Editing the Profile
   * PATCH https://around.nomoreparties.co/v1/groupId/users/me
   */
  setUserInfos({name, about}) {
    return fetch(this._baseUrl + '/users/me', {
      headers: this._headers,
      method: "PATCH",
      body: JSON.stringify({
        name,
        about
      })
    })
    .then(res => this._checkResult(res))
  }
}

const api = new Api({
  // baseUrl: "https://around.nomoreparties.co/v1/group-5",
  baseUrl: "http://localhost:3000",
  headers: {
    authorization: "a0a03679-4255-43a8-85cb-b4bca24b592e",
    "Content-Type": "application/json"
  }
});

export default api;
