import axios from "axios";
import dayjs from "dayjs";
import { jwtDecode } from "jwt-decode";

const token = localStorage.getItem("access")
  ? JSON.parse(localStorage.getItem("access") || "")
  : "";
// const refresh_token = localStorage.getItem("refresh")
//   ? JSON.parse(localStorage.getItem("refresh") || "")
//   : "";

const baseURL = "http://localhost:8000/api/v1/";
const axiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 5000,
  headers: {
    Authorization: token ? `Bearer ${token}` : "",
    "Content-Type": "application/json",
    accept: "application/json",
  },
});

axiosInstance.interceptors.request.use(
  async (req) => {
    const token = localStorage.getItem("access")
      ? JSON.parse(localStorage.getItem("access") || "")
      : "";

    if (token) {
      req.headers.Authorization = `Bearer ${token}`;

      const user = jwtDecode(token);
      const isExpired = dayjs.unix(user.exp!).diff(dayjs()) < 1;

      if (isExpired) {
        const refresh_token = localStorage.getItem("refresh")
          ? JSON.parse(localStorage.getItem("refresh") || "")
          : "";

        const response = await axios.post(`${baseURL}auth/token/refresh/`, {
          refresh: refresh_token,
        });

        if (response.data) {
          localStorage.setItem("access", JSON.stringify(response.data.access));
          req.headers.Authorization = `Bearer ${response.data.access}`;

          return req;
        } else {
          const res = await axios.post(`${baseURL}auth/logout/`, {
            refresh: refresh_token,
          });

          if (res.data) {
            localStorage.removeItem("access");
            localStorage.removeItem("refresh");
            localStorage.removeItem("user");
          }
        }
      }
    }
    return req;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
