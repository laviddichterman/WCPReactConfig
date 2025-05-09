import axios from 'axios';
// config
import { HOST_API } from '../config';

// ----------------------------------------------------------------------

export const axiosInstance = axios.create({
  baseURL: HOST_API,
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);