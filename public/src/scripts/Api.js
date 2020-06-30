export class Api {
  constructor(url, token) {
      this.url = url;
      this.token = token;
  }

  getInitialInfo() {
      return fetch(this.url, {
              headers: {
                  authorization: this.token,
              },
          })
          .then((res) => {
              this.responseCheck(res);
              return res.json();
          })
          .catch((err) => {
              console.log(err);
          });
  }

  getInitialCards() {
      return fetch(this.url, {
              headers: {
                  authorization: this.token,
              },
          })
          .then((resj) => {
              this.responseCheck(resj);
              return resj.json();
          })
          .catch((err) => {
              console.log(err);
          });
  }

  postInfo(json) {
      this.json = json;
      return fetch(this.url, {

              method: 'PATCH',
              headers: {
                  authorization: this.token,
                  'Content-Type': 'application/json',
              },
              body: this.json,
          })
          .then((res) => {
              this.responseCheck(res);
              return res.json();
          })
          .catch((err) => {
              console.log(err);
          });
  }

  postCard(json) {
      this.json = json;
      return fetch(this.url, {

              method: 'POST',
              headers: {
                  authorization: this.token,
                  'Content-Type': 'application/json',
              },
              body: this.json,
          })
          .then((res) => {
              this.responseCheck(res);
              return res.json();
          })
          .catch((err) => {
              console.log(err);
          });
  }

  reCard() {
      return fetch(this.url, {

              method: 'DELETE',
              headers: {
                  authorization: this.token,
              },
          })
          .then((res) => {
              this.responseCheck(res);
              return res.json();
          })
          .catch((err) => {
              console.log(err);
          });
  }

  likeCard() {
      return fetch(this.url, {

              method: 'PUT',
              body: this.json,
              headers: {
                  authorization: this.token,
                  'Content-Type': 'application/json',
              },
          })
          .then((res) => {
              this.responseCheck(res);
              return res.json();
          })
          .catch((err) => {
              console.log(err);
          });
  }

  deleteLikeCard() {
      return fetch(this.url, {

              method: 'DELETE',
              headers: {
                  authorization: this.token,
              },
          })
          .then((res) => {
              this.responseCheck(res);
              return res.json();
          })
          .catch((err) => {
              console.log(err);
          });
  }

  addAvatar(json) {
      this.json = json;
      return fetch(this.url, {

              method: 'PATCH',
              headers: {
                  authorization: this.token,
              },
              body: this.json,
          })
          .then((res) => {
              this.responseCheck(res);
              return res.json();
          })
          .catch((err) => {
              console.log(err);
          });
  }

  responseCheck(res) {
      if (res.ok) {
          return res;
      }
      return Promise.reject(res.status);
  }
}
