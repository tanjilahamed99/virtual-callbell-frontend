import { BASE_URL } from "@/config/constant";
import axios from "axios";

const login = (data) => {
  return axios.post(`${BASE_URL}/auth/login`, data);
};

export default login;
