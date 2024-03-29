import { useEffect, useState } from "react";
import axios from "axios";

export const useFetch = (url: string, configOptions?: object) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get(url, configOptions)
      .then((response) => setData(response.data))
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, [url])

  return { data, loading, error };
}
