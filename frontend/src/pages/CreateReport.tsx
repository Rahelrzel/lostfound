import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import api from '../services/api';
import ReportForm, { ReportFormData } from '../components/ReportForm';

export function buildReportBody(data: ReportFormData) {
  const body = new FormData();
  body.append('type', data.type);
  body.append('title', data.title);
  body.append('description', data.description);
  body.append('category', data.category);
  body.append('location', data.location);
  body.append('date', data.date);
  if (data.image) body.append('image', data.image);
  return body;
}

export default function CreateReport() {
  const navigate = useNavigate();
  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: '/report/new' }} replace />;
  }

  async function handleSubmit(data: ReportFormData) {
    setLoading(true);
    setError(null);
    try {
      await api.post('/api/reports', buildReportBody(data));
      navigate('/reports');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Could not post the report. Try again.');
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-slate-900">Post a report</h1>
      <p className="mt-1 text-sm text-slate-600">
        The more detail you add, the easier it is for someone to match it.
      </p>

      {error && (
        <div className="mt-6 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-8">
        <ReportForm onSubmit={handleSubmit} loading={loading} submitLabel="Post report" />
      </div>
    </div>
  );
}