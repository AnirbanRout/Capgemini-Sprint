import axios from "axios";
import { Platform } from "react-native";
import BASE_URL from "./config";

const baseURL = Platform.OS === "android" ? BASE_URL : "http://localhost:3000";

const Api = axios.create({
  baseURL,
});

export default Api;
