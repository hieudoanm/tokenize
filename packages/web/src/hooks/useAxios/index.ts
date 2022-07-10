import { AxiosRequestConfig } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { axiosGet } from '../../utils/axios';

const useAxios = <T>(
  url: string,
  configs: AxiosRequestConfig = {}
): { loading: boolean; error: any; data: T | null; refetch: () => void } => {
  const [refetchIndex, setRefetchIndex] = useState<number>(0);

  const [state, setState] = useState<{
    loading: boolean;
    error: any;
    data: T | null;
  }>({ loading: true, error: null, data: null });

  const refetch = useCallback(() => setRefetchIndex((prev) => prev + 1), []);

  useEffect(() => {
    const getData = async () => {
      setState({ loading: true, error: null, data: null });
      try {
        const data: T = await axiosGet<T>(url, configs);
        setState({ loading: false, error: null, data });
      } catch (error) {
        console.error(error);
        setState({ loading: false, error, data: null });
      }
    };
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetchIndex]);

  return { ...state, refetch };
};

export default useAxios;
