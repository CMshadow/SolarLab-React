import axios from 'axios';

const instance = axios.create({
  baseURL : 'https:/api.solarlabdemo.com/hello',
})

export default instance;
