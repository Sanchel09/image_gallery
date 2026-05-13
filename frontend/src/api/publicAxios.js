import axios from "axios";
import { BASE_URL } from "../utils/Constants";

const publicAxios = axios.create({
  baseURL: BASE_URL, // Adjust to match your backend
});

export default publicAxios;
