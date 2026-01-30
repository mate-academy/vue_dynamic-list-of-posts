import axios from "axios";

const BASE_URL = "https://mate.academy/students-api";

const client = axios.create({ baseURL: BASE_URL });

export default client;
