import axios from 'axios';

export const axiosClient = axios.create({
  baseURL: 'https://api.yourdomain.com',
  timeout: 10000,
});
