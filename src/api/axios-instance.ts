import axios from "axios";

export const instance = axios.create({
  baseURL: 'https://social-network.samuraijs.com/api/1.1/',
  withCredentials: true,
  headers: {
    'API-KEY': '52a1ca5e-dff7-4291-84cc-1f73b5c262f4'
  },
});
