import {} from "react";

/**
 *
 * @param {string} token
 */
function saveToken(token) {
  localStorage.setItem("token", token);
}

/**
 *
 * @return {string}
 */
function getToken() {
  return localStorage.getItem("token");
}

function removeToken() {
  localStorage.removeItem("token");
}

export default {
  saveToken,
  getToken,
  removeToken
};
