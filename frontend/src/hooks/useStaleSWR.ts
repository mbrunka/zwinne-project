import axios from "axios";
import useSWR, { useSWRConfig } from "swr";

const fetcher = (url) => axios.get(url).then((res) => res.data);

export const useStaleSWR = (dataKey) => {
  const { cache } = useSWRConfig();
  const revalidationOptions = {
    revalidateOnMount: !cache.get(dataKey),
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  };

  return useSWR(dataKey, fetcher, revalidationOptions);
};
