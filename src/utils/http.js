import axios from 'axios';

export const client = axios.create({
  baseURL: 'https://mate-academy.github.io/fe-students-api',
});