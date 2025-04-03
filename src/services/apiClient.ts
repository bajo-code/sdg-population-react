import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://restcountries.com/v3.1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000,
});

export default apiClient;