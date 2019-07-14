import axios from "axios";

const BASE_URL = "http://localhost:5000";

class Network {
  static instance = new Network();
  _token = "";
  constructor() {
    if (Network.instance) {
      throw new Error(
        "Error: Instantiation failed: Use Network.getInstance() instead of new."
      );
    }
    Network.instance = this;
  }
  static getInstance() {
    return Network.instance;
  }

  getBaseUrl() {
    return BASE_URL;
  }

  setToken(token) {
    this.token = token;
  }

  getToken() {
    return this.token;
  }

  /**
   * @typedef {"POST" | "GET" | "PATCH" | "DELETE" | "PUT"} RequestType
   * @param {string} url
   * @param {RequestType} method
   * @param {object} [data]
   * @param {object} [params]
   * @param {object} [header]
   */
  unAuthorizedRequest(url, method = "GET", data, params, header) {
    const response = axios({
      method: method,
      url: url,
      baseURL: BASE_URL,
      data: data,
      params: params,
      timeout: 60000,
      headers: {
        ...header,
        "Content-Type": "application/json"
      }
    });
    return response;
  }

  /**
   * @param {string} url
   * @param {RequestType} method
   * @param {object} [data]
   * @param {object} [params]
   * @param {object} [header]
   */
  authorizedRequest(url, method = "GET", data, params, header) {
    const response = axios({
      method: method,
      url: url,
      baseURL: BASE_URL,
      data: data,
      params: params,
      timeout: 60000,
      headers: {
        ...header,
        "Content-Type": "application/json",
        access_token: this.token
      }
    });
    return response;
  }
}

const ErrorCodeMaps = {
  200: "Success",
  404: "Page not found",
  422: "Invalid request",
  500: "Internal errror"
};

function getError(errorCode, fallback = "Unknown Error") {
  let _fallback = "Unknown Error";
  if (fallback && fallback !== "") {
    _fallback = fallback;
  }

  const errorMessage = ErrorCodeMaps[errorCode] || _fallback;

  return {
    errorCode,
    errorMessage
  };
}

axios.interceptors.request.use(
  function(config) {
    // @ts-ignore
    if (process.env.NODE_ENV === "development") {
      const { url, method, data, params, baseURL } = config;
      const message = `👉👉👉
Request Info: ${baseURL}${url}
  - Method : ${method}
  - Data   : ${JSON.stringify(data)}
  - Params : ${params}

  `;
      console.log(message);
    }

    return config;
  },
  function(error) {
    if (process.env.NODE_ENV === "development") {
      console.log("❌❌❌ Request Error: ", error);
    }
    return Promise.reject(error);
  }
);

// Add a response interceptor
axios.interceptors.response.use(
  function(response) {
    if (process.env.NODE_ENV === "development") {
      const { data: responseData, config } = response;
      const { url, method, data, params } = config;
      const message = `👉👉👉
Response info: ${url}
  - Method : ${method}
  - Data   : ${JSON.stringify(responseData)}
  - Params : ${params}
  - Response Data: ${data}
  `;
      console.log(message);
    }

    return response.data;
  },
  function(error) {
    if (process.env.NODE_ENV === "development") {
      console.log("❌❌❌ Response error: ", error.response.data);
    }

    return Promise.reject(error);
  }
);

export default Network.getInstance();
