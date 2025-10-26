import axios from 'axios';
import { HOST } from '../constants';

const axiosInstance = new axios.create({
  baseURL: HOST,
  headers: {
    'Content-Type': 'application/json',
    accept: 'application/json',
  },
  withCredentials: true,
});

export default axiosInstance;
