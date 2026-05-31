import { useEffect, useRef, useState } from 'react';
import { safeFetch } from '../api/safeFetch';

export function useSafeQuery(url: string) {
  const [data, setData] = useState<any>(null);
  const requestId = useRef(0);

  useEffect(() => {
    const id = ++requestId.current;

    safeFetch(url).then((res) => {
      if (id === requestId.current) {
        setData(res);
      }
    });
  }, [url]);

  return data;
}