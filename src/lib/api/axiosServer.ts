import axios from 'axios';

const axiosServer = axios.create({ baseURL: process.env.API_URI_DEV });

export default axiosServer;