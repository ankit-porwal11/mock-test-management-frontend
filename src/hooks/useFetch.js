import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Generic data-fetching hook.
 *
 * @param {Function} serviceFn  - An async function that returns data (e.g. a service call).
 * @param {Array}    deps       - Dependency array; the fetch re-runs when any value changes.
 * @param {boolean}  immediate  - Whether to fetch immediately on mount (default: true).
 * @returns {{ data: any, loading: boolean, error: any, refetch: Function }}
 */
const useFetch = (serviceFn, deps = [], immediate = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  // Keep the latest serviceFn in a ref so the effect closure is never stale.
  const serviceFnRef = useRef(serviceFn);
  serviceFnRef.current = serviceFn;

  const mountedRef = useRef(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await serviceFnRef.current();
      if (mountedRef.current) {
        setData(result?.data ?? result);
        setLoading(false);
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err.response?.data?.message || err.message || 'Something went wrong');
        setLoading(false);
      }
    }
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    mountedRef.current = true;

    if (immediate) {
      fetchData();
    }

    return () => {
      mountedRef.current = false;
    };
  }, [fetchData, immediate]);

  return { data, loading, error, refetch: fetchData };
};

export default useFetch;
