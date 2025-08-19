import { BASE_URL } from "@/config/constant";
import axios from "axios";

const updateUser = ({ id, data }) => {
  return axios.put(`${BASE_URL}/users/update/${id}`, data);
};

export default updateUser;
