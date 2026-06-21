import { useEffect, useState } from 'react';
import { api } from '../lib/api';

type Reminder = { id: string; title: string; dueAt: string; type: string; horse?: { name: string } | null };

export default function Calendar() {
  const [items, setItems] = useState<Reminder[]>([]);
  useEffect(() => { api.get('/reminders/upcoming').then((r) => setItems(r.data)).catch(() => {}); }, []);

  const grouped = items.reduce<Record<string, Reminder[]>>((acc, r) => {
    const k = new Date(r.dueAt).toLocaleDateString();
    (acc[k] ??= []).push(r);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Calendar — next 30 days</h1>
      <div className="space-y-3">
        {Object.entries(grouped).map(([day, list]) => (
          <div key={day} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
            <div className="px-4 py-2 font-semibold border-b border-slate-100 dark:border-slate-800">{day}</div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {list.map((r) => (
                <div key={r.id} className="px-4 py-2 flex justify-between text-sm">
                  <span>{r.title}</span>
                  <span className="text-slate-500">{r.horse?.name ?? '—'} · {r.type}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
        {items.length === 0 && <div className="text-sm text-slate-500">No upcoming events.</div>}
      </div>
    </div>
  );
}
