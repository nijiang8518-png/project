import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../lib/api';

export default function HorseDetail() {
  const { id } = useParams();
  const [horse, setHorse] = useState<any>(null);
  const [tab, setTab] = useState<'profile' | 'health' | 'farrier' | 'training'>('profile');

  useEffect(() => { if (id) api.get(`/horses/${id}`).then((r) => setHorse(r.data)).catch(() => {}); }, [id]);
  if (!horse) return <div>Loading…</div>;

  const Tab = (k: typeof tab, label: string) => (
    <button onClick={() => setTab(k)} className={`px-3 py-1.5 rounded-md text-sm ${tab === k ? 'bg-brand-500 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}>{label}</button>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-2xl">🐎</div>
        <div>
          <h1 className="text-2xl font-bold">{horse.name}</h1>
          <div className="text-sm text-slate-500">{horse.breed} · {horse.status}</div>
        </div>
      </div>
      <div className="flex gap-2">
        {Tab('profile', 'Profile')}
        {Tab('health', 'Health')}
        {Tab('farrier', 'Farrier')}
        {Tab('training', 'Training')}
      </div>
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 text-sm">
        {tab === 'profile' && (
          <dl className="grid grid-cols-2 gap-3">
            <div><dt className="text-slate-500">Chip ID</dt><dd>{horse.chipId ?? '—'}</dd></div>
            <div><dt className="text-slate-500">DOB</dt><dd>{horse.dateOfBirth ? new Date(horse.dateOfBirth).toLocaleDateString() : '—'}</dd></div>
            <div><dt className="text-slate-500">Sex</dt><dd>{horse.sex ?? '—'}</dd></div>
            <div><dt className="text-slate-500">Color</dt><dd>{horse.color ?? '—'}</dd></div>
            <div><dt className="text-slate-500">Height (cm)</dt><dd>{horse.heightCm ?? '—'}</dd></div>
            <div><dt className="text-slate-500">Weight (kg)</dt><dd>{horse.weightKg ?? '—'}</dd></div>
            <div><dt className="text-slate-500">Sire</dt><dd>{horse.sireName ?? '—'}</dd></div>
            <div><dt className="text-slate-500">Dam</dt><dd>{horse.damName ?? '—'}</dd></div>
            <div><dt className="text-slate-500">Stable</dt><dd>{horse.stableLocation ?? '—'}</dd></div>
            <div><dt className="text-slate-500">Owner</dt><dd>{horse.owner?.name ?? '—'}</dd></div>
          </dl>
        )}
        {tab === 'health' && (
          <div className="space-y-3">
            <div className="font-semibold">Vaccinations</div>
            {(horse.vaccinations ?? []).map((v: any) => (
              <div key={v.id} className="flex justify-between border-b border-slate-100 dark:border-slate-800 py-2">
                <span>{v.vaccineName}</span><span className="text-slate-500">{new Date(v.givenAt).toLocaleDateString()}</span>
              </div>
            ))}
            <div className="font-semibold pt-2">Deworming</div>
            {(horse.dewormings ?? []).map((v: any) => (
              <div key={v.id} className="flex justify-between border-b border-slate-100 dark:border-slate-800 py-2">
                <span>{v.product}</span><span className="text-slate-500">{new Date(v.givenAt).toLocaleDateString()}</span>
              </div>
            ))}
            <div className="font-semibold pt-2">Vet Visits</div>
            {(horse.vetRecords ?? []).map((v: any) => (
              <div key={v.id} className="border-b border-slate-100 dark:border-slate-800 py-2">
                <div className="flex justify-between"><span>{v.diagnosis ?? 'Visit'}</span><span className="text-slate-500">{new Date(v.visitDate).toLocaleDateString()}</span></div>
                <div className="text-slate-500 text-xs">{v.vetName}</div>
              </div>
            ))}
          </div>
        )}
        {tab === 'farrier' && (
          <div>
            {(horse.farrierRecords ?? []).map((v: any) => (
              <div key={v.id} className="flex justify-between border-b border-slate-100 dark:border-slate-800 py-2">
                <span>{v.serviceType ?? 'Visit'} — {v.farrierName}</span>
                <span className="text-slate-500">{new Date(v.visitDate).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        )}
        {tab === 'training' && (
          <div>
            {(horse.trainingLogs ?? []).map((v: any) => (
              <div key={v.id} className="flex justify-between border-b border-slate-100 dark:border-slate-800 py-2">
                <span>{v.discipline ?? 'Session'} — {v.durationMin ?? '?'} min</span>
                <span className="text-slate-500">{new Date(v.date).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
