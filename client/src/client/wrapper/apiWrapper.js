import axios from "axios";
import ENDPOINTS from "../commons/Endpoints";

const AxiosInstance = axios.create({
  baseURL:
    process.env.NODE_ENV == "production"
      ? ENDPOINTS.REMOTE_ENDPOINTS
      : ENDPOINTS.LOCAL_ENDPOINTS,
});


export default AxiosInstance;



