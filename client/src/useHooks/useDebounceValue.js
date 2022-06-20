import { useCallback, useEffect, useState } from "react";
import axiosClient, { apiPaths } from "../axiosClient";

export default function useDebounceValue(field, value) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unique, setUnique] = useState(false);

  const checkUnique = useCallback(
    async function (controller) {
      try {
        // check unique request
        const { data } = await axiosClient.post(
          apiPaths.checkUnique,
          { field, value },
          { signal: controller.signal }
        );
        return data;
      } catch (error) {
        throw new Error(
          error?.response ? error.response.data.error : error.message
        );
      }
    },
    [field, value]
  );

  const resetState = useCallback(function () {
    // reset state
    setLoading(false);
    setError(false);
    setUnique(false);
  }, []);

  useEffect(() => {
    // called when value changes
    resetState();
    if (value === "") {
      return;
    }
    // abort controller to abort request
    const controller = new AbortController();
    // timeout to make request
    const timeout = setTimeout(async () => {
      try {
        setLoading(true);
        // check unique
        const data = await checkUnique(controller);
        setError("");
        setUnique(data.unique);
      } catch (error) {
        setError(error.message);
        setUnique(false);
      } finally {
        setLoading(false);
      }
    }, 2000);
    return () => {
      // cleanup => clear timeout and abort request
      clearTimeout(timeout);
      controller.abort();
    };
  }, [checkUnique, value, resetState]);

  return { unique, loading, error };
}
