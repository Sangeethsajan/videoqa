import axios,{AxiosRequestConfig} from 'axios';
const BASE_URL = process.env.NEXT_PUBLIC_ENVIRONMENT == "development" ? 'http://localhost:8000' : 'http://172.190.112.201:8000'
const makeAPIRequest = async (url: string, method: string, data: FormData,config?: AxiosRequestConfig) => {
  try {
    const response = await axios({
      method,
      url: `${BASE_URL}/${url}`,
      data,
      ...config
    });
    return response.data;
  } catch (error) {
    console.error("API request failed:", error);
    return null;
  }
}
export default makeAPIRequest;