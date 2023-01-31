import {axiosClient} from "./AxiosApi";

const authApi = {
  login: (data) => {
    const url = `/Account/login`;
    return axiosClient.post(url,data);
  },
  signup:(data) => {
    const url = `/Account/register`;
    return axiosClient.post(url, data);
  }
};

export default authApi;
