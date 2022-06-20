const axios = require("axios");

// back end api paths
export const apiPaths = {
  checkUnique: "/auth/check-unique",
  register: "/auth/register",
  login: "/auth/login",
  authorize: "/auth/authorize",
  passwordResetCreate: "/auth/password-reset/create",
  passwordResetVerify: "/auth/password-reset/verify",
  passwordResetUpdate: "/auth/password-reset/update",
  urls: "/urls",
};

// axios client
const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
});

export default axiosClient;
