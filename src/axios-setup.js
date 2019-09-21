import axios from 'axios';

const instance = axios.create({
  baseURL : 'https:/api.solarlabdemo.com/',
})

export default instance;
