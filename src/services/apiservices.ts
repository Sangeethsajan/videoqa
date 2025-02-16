import axios,{AxiosRequestConfig} from 'axios';
const BASE_URL = process.env.NEXT_PUBLIC_ENVIRONMENT == "development" ? 'http://localhost:8000' : 'https://server.clowderin.com'
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