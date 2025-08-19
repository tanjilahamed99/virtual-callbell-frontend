import { BASE_URL } from "@/config/constant";
import axios from "axios";

const register = (data) => {
  return axios.post(`${BASE_URL}/auth/register`, data);
};

export default register;
