import {Injectable} from '@angular/core';

const HOST = 'https://tk-movie-nodejs.herokuapp.com/';
// const HOST = 'http://localhost:4000/';

@Injectable()
export class UserServiceClient {

  findAllUsers() {
    return fetch(HOST + 'api/user/')
      .then(response => response.json());

  }
  findUserById(userId) {
    return fetch(HOST + 'api/user/' + userId)
      .then(response => response.json());
  }

  deleteUserById(userId) {
    return fetch(HOST + 'api/user/' + userId + '/delete', {
      method: 'delete'
    })
      .then(response => response.json());
  }

  findUserByUsername(username) {
    return fetch(HOST + 'api/user/username/' + username)
      .then(response => response.json());
  }

  // findUserByCredentials(username, password) {
  //   return fetch('http://localhost:4000/api/user/username/' + username + '/password/' + password)
  //     .then(response => response.json());
  // }

  checkStatus() {
    return fetch(HOST + 'api/status',
      {
        credentials: 'include', // include, same-origin, *omit
      })
      .then(response => response.json());
  }

  updateUser(user) {
    return fetch(HOST + 'api/user/update', {
      body: JSON.stringify(user),
      credentials: 'include', // include, same-origin, *omit
      method: 'put',
      headers: {
        'content-type': 'application/json'
      }
    }).then(response =>
      response.json()
    );
  }

  updateUserById(userId, user) {
    return fetch(HOST + 'api/user/' + userId + '/update', {
      body: JSON.stringify(user),
      method: 'put',
      headers: {
        'content-type': 'application/json'
      }
    }).then(response =>
      response.json()
    );
  }

  login(username, password) {
    const credentials = {
      username: username,
      password: password
    };
    return fetch(HOST + 'api/login', {
      method: 'post',
      body: JSON.stringify(credentials),
      credentials: 'include',
      headers: {
        'content-type': 'application/json'
      }
    }).then(response =>
      response.json());
  }

  logout() {
    return fetch(HOST + 'api/logout', {
      method: 'post',
      credentials: 'include'
    });
  }

  profile() {
    return fetch(HOST + 'api/profile',
      {
        credentials: 'include', // include, same-origin, *omit
      })
      .then(response => response.json());
  }

  isAdmin() {
    return fetch(HOST + 'api/admin/status',
      {
        credentials: 'include', // include, same-origin, *omit
      })
      .then(response => response.json());
  }

  register(user) {
    return fetch(HOST + 'api/register', {
      body: JSON.stringify(user),
      credentials: 'include', // include, same-origin, *omit
      method: 'post',
      headers: {
        'content-type': 'application/json'
      }
    });
  }

  createUser(user) {
    return fetch(HOST + 'api/user', {
      body: JSON.stringify(user),
      method: 'post',
      headers: {
        'content-type': 'application/json'
      }
    });
  }
}
