import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../lib/api';
import Card from '../components/Card';

type Summary = {
  totals: { totalHorses: number; active: number; resting: number; retired: number; sold: number; pendingReminders: number };
  upcoming: Array<{ id: string; title: string; dueAt: string; horse?: { name: string } | null }>;
};

export default function Dashboard() {
  const { t } = useTranslation();
  const [data, setData] = useState<Summary | null>(null);
  useEffect(() => { api.get('/dashboard/summary').then((r) => setData(r.data)).catch(() => {}); }, []);

  if (!data) return <div>Loading…</div>;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card title={t('dashboard.totalHorses')} value={data.totals.totalHorses} />
        <Card title={t('dashboard.active')} value={data.totals.active} />
        <Card title={t('dashboard.resting')} value={data.totals.resting} />
        <Card title={t('dashboard.retired')} value={data.totals.retired} />
        <Card title={t('dashboard.pending')} value={data.totals.pendingReminders} />
      </div>
      <section>
        <h2 className="text-lg font-semibold mb-2">{t('dashboard.upcoming')}</h2>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 divide-y divide-slate-100 dark:divide-slate-800">
          {data.upcoming.length === 0 && <div className="p-4 text-sm text-slate-500">—</div>}
          {data.upcoming.map((r) => (
            <div key={r.id} className="flex justify-between p-3 text-sm">
              <div>
                <div className="font-medium">{r.title}</div>
                <div className="text-slate-500">{r.horse?.name ?? '—'}</div>
              </div>
              <div className="text-slate-500">{new Date(r.dueAt).toLocaleDateString()}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
