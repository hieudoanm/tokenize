import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

export const axiosGet = <T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> => {
  return new Promise((resolve, reject) => {
    axios
      .get(url, config)
      .then((response: AxiosResponse<T>) => {
        resolve(response.data);
      })
      .catch((error: AxiosError<T>) => {
        reject(error.response?.data);
      });
  });
};
