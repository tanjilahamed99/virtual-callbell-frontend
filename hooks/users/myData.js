import { BASE_URL } from "@/config/constant";
import axios from "axios";

const myData = ({ id }) => {
  return axios.get(`${BASE_URL}/users/myData/${id}`);
};

export default myData;
