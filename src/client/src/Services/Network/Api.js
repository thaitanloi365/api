import Network from "./Network";

function login(email, password) {
  return new Promise((resolve, reject) => {
    const body = {
      email,
      password
    };
    Network.unAuthorizedRequest("/api/login", "POST", body)
      .then(user => {
        console.log(user);
        resolve(user);
      })
      .catch(error => {
        console.log("error", error);
        reject(error);
      });
  });
}

export default {
  login
};
