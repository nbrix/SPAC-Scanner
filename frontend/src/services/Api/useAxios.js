import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { APIEndpoint } from "../../constants";
import { useHistory } from "react-router-dom";
import isDeepEqual from "fast-deep-equal/react";

axios.defaults.baseURL = APIEndpoint;

const useAxios = (config) => {
  const configRef = useRef(config);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setloading] = useState(true);
  const history = useHistory();

  if (!isDeepEqual(configRef.current, config)) {
    configRef.current = config;
    setError(false);
  }

  useEffect(() => {
    let body = config.body ? { data: config.body } : null;
    let header = config.headers ? { headers: config.headers } : null;

    // axios changes parameter positions dependent on post and get requests.
    if (config.method === 'get') body = header;

    axios[config.method](config.url, body, header)
      .then((res) => {
        setResponse(res.data);
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status > 400) {
            history.replace(history.location.pathname, {
              errorStatusCode: err.response.status,
            });
          }
        }
        setError(true);
      })
      .finally(() => {
        setloading(false);
      });
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [configRef.current, history]);

  return [response, loading, error];
};

export default useAxios;
