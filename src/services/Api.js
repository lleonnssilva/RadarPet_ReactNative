import axios from "axios";

// export const baseUrl = "https://api-instagram-leo.herokuapp.com";
export const baseUrl = "http://10.0.0.5:3333";
export const api = axios.create({
  baseURL: baseUrl
});

export default { api, baseUrl };
