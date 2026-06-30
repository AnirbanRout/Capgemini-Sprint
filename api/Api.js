import axios from "axios";
import { Platform } from "react-native";

const Api = axios.create({
  baseURL:
    Platform.OS === "android"
      ? "http://192.168.0.105:3000"
      : "http://localhost:3000",
});

export default Api;
