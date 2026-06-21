import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useAuth } from '../lib/auth';
import i18n from '../i18n';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const loc = useLocation();
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  const link = (to: string, label: string) => (
    <Link
      to={to}
      className={`px-3 py-2 rounded-md text-sm font-medium ${
        loc.pathname === to
          ? 'bg-brand-500 text-white'
          : 'text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800'
      }`}
    >
      {label}
    </Link>
  );

  const setLang = (lng: string) => { i18n.changeLanguage(lng); localStorage.setItem('lang', lng); };

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <div className="text-xl font-bold">🐎 {t('app.title')}</div>
          <nav className="flex gap-1 ml-4">
            {link('/', t('nav.dashboard'))}
            {link('/horses', t('nav.horses'))}
            {link('/calendar', t('nav.calendar'))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <button onClick={() => setLang(i18n.language === 'zh' ? 'en' : 'zh')} className="text-sm px-2 py-1 rounded border border-slate-300 dark:border-slate-700">
              {i18n.language === 'zh' ? 'EN' : '中文'}
            </button>
            <button onClick={() => setDark(!dark)} className="text-sm px-2 py-1 rounded border border-slate-300 dark:border-slate-700">
              {dark ? '☀️' : '🌙'}
            </button>
            <button onClick={logout} className="text-sm px-2 py-1 rounded bg-slate-200 dark:bg-slate-800">
              {t('nav.logout')}
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto p-4">{children}</main>
    </div>
  );
}
