import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';

type Horse = { id: string; name: string; breed?: string; status: string };

export default function Horses() {
  const { t } = useTranslation();
  const [horses, setHorses] = useState<Horse[]>([]);
  useEffect(() => { api.get('/horses').then((r) => setHorses(r.data)).catch(() => {}); }, []);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t('horses.title')}</h1>
        <button className="px-3 py-1.5 rounded bg-brand-500 text-white text-sm">{t('horses.new')}</button>
      </div>
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 dark:bg-slate-800">
            <tr>
              <th className="text-left p-3">{t('common.name')}</th>
              <th className="text-left p-3">{t('common.breed')}</th>
              <th className="text-left p-3">{t('common.status')}</th>
              <th className="text-left p-3">{t('common.actions')}</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-950 divide-y divide-slate-100 dark:divide-slate-800">
            {horses.map((h) => (
              <tr key={h.id}>
                <td className="p-3 font-medium">{h.name}</td>
                <td className="p-3">{h.breed ?? '—'}</td>
                <td className="p-3">{h.status}</td>
                <td className="p-3"><Link className="text-brand-500 hover:underline" to={`/horses/${h.id}`}>→</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
