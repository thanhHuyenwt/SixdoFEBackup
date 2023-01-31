import axios from "axios";
import queryString from "query-string";

// Set up default config for http requests here
// Please have a look at here `https://github.com/axios/axios#request- config` for the full list of configs
const axiosClient = axios.create({
  baseURL: "https://localhost:7135/api",
  headers: {
    "content-type": "application/json",
  },
  paramsSerializer: (params) => queryString.stringify(params),
});

const axiosAuth = axios.create({
  baseURL: "https://localhost:7135/api",
  headers: {
    "content-type": "application/json",
  },
  paramsSerializer: (params) => queryString.stringify(params),
});
axiosAuth.interceptors.request.use(async (config) => {
  // Handle access token here ...
  const token = localStorage.getItem("access-token");
  config.headers.Authorization = `bearer ${token}`;
  return config;
});
axiosClient.interceptors.request.use(async (config) => {
  // Handle access token here ...
  return config;
});
//handle refresh token here
axiosAuth.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    // Handle errors
    throw error;
  }
);
axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    // Handle errors
    throw error;
  }
);
export  {axiosClient,axiosAuth};