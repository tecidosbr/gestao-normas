import { useEffect, useState } from "react";

export function useFetchApi<T>(path: string) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<T | null>(null);
  
    useEffect(() => {
      (async () => {
        try {
          setData(null);
          setLoading(true);
          const response = await fetch(`${process.env.SERVICE_URL}/${path}`, {
            headers: {
              'Authorization': `Bearer ${sessionStorage.getItem('idToken')}` 
            }
          });
          setData(await response.json());
        } catch (e) {
          setError(e);
        } finally {
          setLoading(false);
        }
      })();
    }, [path]);
  
    return { data, loading, error };
  }
  