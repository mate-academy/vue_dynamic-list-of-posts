import axios, { AxiosInstance } from 'axios';

const BASE_URL = 'https://mate.academy/students-api';

const client: AxiosInstance = axios.create({
  baseURL: BASE_URL,
});

export default client;