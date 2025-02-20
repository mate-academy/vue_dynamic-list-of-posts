import { BASE_URL } from '@/constans';
import axios from 'axios';

export const client = axios.create({
  baseURL: BASE_URL,
});
