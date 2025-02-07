import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useApi = <T>(key: string, path: string) => {
  const returnValue = useQuery<T>({
    queryKey: [key],
    queryFn: async () => {
      const result = await axios.get(
        `${import.meta.env.VITE_API_URL}/${path}`,
        {
          withCredentials: true,
        }
      );
      return result.data;
    },
  });

  return returnValue;
};
