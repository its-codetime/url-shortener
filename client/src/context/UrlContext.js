import {
  useState,
  useContext,
  createContext,
  useEffect,
  useCallback,
} from "react";
import { useAuth } from "./AuthContext.js";
import axiosClient, { apiPaths } from "../axiosClient.js";

const UrlContext = createContext();

export function UrlContextProvider({ children }) {
  const { user } = useAuth();
  const [urls, setUrls] = useState([]);
  const [urlLimit, setUrlLimit] = useState(0);

  const getUrls = useCallback(async () => {
    try {
      const headers = { Authorization: `Bearer ${user.token}` };
      const { data } = await axiosClient.get(apiPaths.urls, { headers });
      setUrls(data.urls);
      setUrlLimit(data.urlLimit);
    } catch (error) {
      console.error(error);
    }
  }, [user]);

  const addUrl = useCallback(
    async (url) => {
      try {
        const headers = { Authorization: `Bearer ${user.token}` };
        const { data } = await axiosClient.post(
          apiPaths.urls,
          { url },
          { headers }
        );
        const { userId, ...newUrl } = data.newUrl;
        setUrls((urls) => {
          urls.push(newUrl);
          return urls;
        });
        setUrlLimit(data.urlLimit);
        return newUrl;
      } catch (error) {
        throw new Error(
          error?.response ? error.response.data.error : error.message
        );
      }
    },
    [user]
  );

  const removeUrl = useCallback(
    async (token) => {
      try {
        const headers = { Authorization: `Bearer ${user.token}` };
        const { data } = await axiosClient.delete(apiPaths.urls, {
          headers,
          data: { token },
        });
        setUrls((urls) =>
          urls.filter((url) => url._id !== data.deletedUrl._id)
        );
        setUrlLimit(data.urlLimit);
      } catch (error) {
        console.error(
          error?.response ? error.response.data.error : error.message
        );
      }
    },
    [user]
  );

  useEffect(() => {
    getUrls();
  }, [getUrls]);

  return (
    <UrlContext.Provider value={{ urls, urlLimit, addUrl, removeUrl }}>
      {children}
    </UrlContext.Provider>
  );
}

export const useUrls = () => useContext(UrlContext);
