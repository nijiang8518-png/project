import { useEffect, useState } from 'react';

export function useAuth() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  useEffect(() => {
    const onStorage = () => setToken(localStorage.getItem('token'));
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);
  return {
    token,
    login: (t: string) => { localStorage.setItem('token', t); setToken(t); },
    logout: () => { localStorage.removeItem('token'); setToken(null); },
  };
}
