import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../lib/api';
import { useAuth } from '../lib/auth';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@equine.local');
  const [password, setPassword] = useState('admin123');
  const [err, setErr] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    try {
      const { data } = await api.post('/auth/login', { email, password });
      login(data.token);
      navigate('/');
    } catch (e: any) {
      setErr(e?.response?.data?.error ?? 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        <h1 className="text-2xl font-bold">🐎 {t('login.title')}</h1>
        <div>
          <label className="text-sm">{t('login.email')}</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full mt-1 px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-transparent" />
        </div>
        <div>
          <label className="text-sm">{t('login.password')}</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full mt-1 px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-transparent" />
        </div>
        {err && <div className="text-sm text-red-500">{err}</div>}
        <button className="w-full py-2 rounded bg-brand-500 hover:bg-brand-700 text-white font-medium">{t('login.submit')}</button>
      </form>
    </div>
  );
}
