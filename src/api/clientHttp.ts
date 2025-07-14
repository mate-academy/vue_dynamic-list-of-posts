import axios from 'axios';
import type { AxiosInstance } from 'axios';

export const client: AxiosInstance = axios.create({
  baseURL: 'https://mate.academy/students-api',
});
