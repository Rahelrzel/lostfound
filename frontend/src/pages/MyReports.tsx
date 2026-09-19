import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import api from '../services/api';
import { Report } from '../types';
import ConfirmModal from '../components/ConfirmModal';

type Tab = 'ALL' | 'ACTIVE' | 'RESOLVED';

const TABS: { key: Tab; label: string }[] = [
  { key: 'ALL', label: 'All' },
  { key: 'ACTIVE', label: 'Active' },
  { key: 'RESOLVED', label: 'Resolved' },
];

const CATEGORY_ICONS: Record<string, string> = {
  Phone: '📱',
  Cars: '🚗',
  Pets: '🐾',
  People: '👤',
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function MyReports() {
  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);

  const [reports, setReports] = useState<Report[]>([]);
  const [tab, setTab] = useState<Tab>('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Report | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    let active = true;

    api
      .get('/api/reports/me')
      .then((res) => {
        if (active) setReports(res.data);
      })
      .catch(() => {
        if (active) setError('Could not load your reports.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: '/my-reports' }} replace />;
  }

  const visible = reports.filter((r) => tab === 'ALL' || r.status === tab);

  async function handleDelete() {
    if (!pendingDelete) return;
    const id = pendingDelete._id;
    setPendingDelete(null);
    try {
      await api.delete(`/api/reports/${id}`);
      setReports((prev) => prev.filter((r) => r._id !== id));
    } catch {
      setError('Could not delete that report.');
    }
  }

  async function handleResolve(id: string) {
    try {
      await api.patch(`/api/reports/${id}/resolve`);
      setReports((prev) => prev.map((r) => (r._id === id ? { ...r, status: 'RESOLVED' } : r)));
    } catch {
      setError('Could not mark that report resolved.');
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-slate-900">My reports</h1>
        <Link
          to="/report/new"
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          Post a report
        </Link>
      </div>

      <div className="mt-6 flex gap-6 border-b border-slate-200">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`-mb-px border-b-2 pb-3 text-sm font-medium ${
              tab === t.key
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="mt-6 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <p className="mt-8 text-sm text-slate-600">Loading your reports…</p>
      ) : visible.length === 0 ? (
        <div className="mt-8 rounded-md border border-dashed border-slate-300 px-6 py-12 text-center">
          <p className="text-sm text-slate-600">
            {tab === 'ALL' ? 'You have not posted anything yet.' : `No ${tab.toLowerCase()} reports.`}
          </p>
          {tab === 'ALL' && (
            <Link
              to="/report/new"
              className="mt-3 inline-block text-sm font-medium text-slate-900 underline underline-offset-2"
            >
              Post your first report
            </Link>
          )}
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {visible.map((report) => (
            <li key={report._id} className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded px-2 py-0.5 text-xs font-medium ${
                    report.type === 'LOST'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {report.type}
                </span>
                {report.status === 'RESOLVED' && (
                  <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                    Resolved
                  </span>
                )}
                <h2 className="text-base font-medium text-slate-900">{report.title}</h2>
              </div>

              <p className="mt-2 text-sm text-slate-600">
                {CATEGORY_ICONS[report.category] ?? ''} {report.category} · {report.location} ·{' '}
                {formatDate(report.date)}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  to={`/reports/${report._id}`}
                  className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                >
                  View
                </Link>
                <Link
                  to={`/report/${report._id}/edit`}
                  className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                >
                  Edit
                </Link>
                {report.status === 'ACTIVE' && (
                  <button
                    type="button"
                    onClick={() => handleResolve(report._id)}
                    className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    Mark resolved
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setPendingDelete(report)}
                  className="rounded-md border border-red-200 px-3 py-1.5 text-sm text-red-700 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <ConfirmModal
        isOpen={pendingDelete !== null}
        title="Delete this report?"
        message={`"${pendingDelete?.title}" will be removed for everyone. This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}