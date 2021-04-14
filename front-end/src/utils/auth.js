// export const BASE_URL = "https://abravi-dev.students.nomoreparties.site";
export const BASE_URL = "http://localhost:3001";

export const register = (email, password) => {
  console.log(BASE_URL);
  return fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({email, password})
  })
};

export const authorize = (email, password) => {
  console.log(BASE_URL);
  return fetch(`${BASE_URL}/signin`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password }),
  })
    .then((res) => res.ok ? res.json() : Promise.reject('Error!' + res.statusText))
    .then((data) => {
      if (data.token) {
        localStorage.setItem("jwt", data.token);
        return data;
      }
      return;
    })
};

export const getContent = (token) => {
  console.log(BASE_URL);
  return fetch(`${BASE_URL}/users/me`, {
    method: "GET",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  })
  .then((res) => res.ok ? res.json() : Promise.reject('Error!' + res.statusText))
  .then((data) => data)
};
