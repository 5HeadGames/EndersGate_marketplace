import axios from "axios";

const config: any = axios.defaults;

config.baseURL = process.env.NEXT_PUBLIC_API;
config.headers = {
  ...config.headers,
  "Content-Type": "application/json",
  "X-API-KEY": process.env.NEXT_PUBLIC_OPENSEA_KEY,
};
const client = axios.create(config);

// Data Response Interceptor

export default client;
