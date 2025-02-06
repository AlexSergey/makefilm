import axios from 'axios';

export * from 'axios';

export const rest = axios.create({
  baseURL: process.env['API_URL'] + '/' + process.env['API_PREFIX'],
});
