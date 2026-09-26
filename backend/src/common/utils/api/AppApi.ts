import axios from 'axios';

export const AppApi = axios.create({
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 15_000,
  maxRedirects: 0,
});