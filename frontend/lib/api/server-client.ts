import 'server-only';
import axios from 'axios';

export const API = axios.create({
  baseURL: process.env.API_URL?.replace(/\/$/, ''),
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  validateStatus: () => true,
});
