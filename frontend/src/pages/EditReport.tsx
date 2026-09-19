import { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import api from '../services/api';
import { Report } from '../types';
import ReportForm, { ReportFormData } from '../components/ReportForm';
import { buildReportBody } from './CreateReport';

export default function EditReport() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);

  const [report, setReport] = useState<Report | null>(null);
  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !id) return;
    let active = true;

    api
      .get(`/api/reports/${id}`)
      .then((res) => {
        if (active) setReport(res.data);
      })
      .catch(() => {
        if (active) setError('Could not load this report.');
      })
      .finally(() => {
        if (active) setFetching(false);
      });

    return () => {
      active = false;
    };
  }, [id, isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: `/report/${id}/edit` }} replace />;
  }

  async function handleSubmit(data: ReportFormData) {
    setSaving(true);
    setError(null);
    try {
      await api.put(`/api/reports/${id}`, buildReportBody(data));
      navigate(`/reports/${id}`);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Could not save the changes. Try again.');
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-slate-900">Edit report</h1>

      {error && (
        <div className="mt-6 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {fetching ? (
        <p className="mt-8 text-sm text-slate-600">Loading report…</p>
      ) : report ? (
        <div className="mt-8">
          <ReportForm
            initialValues={report}
            onSubmit={handleSubmit}
            loading={saving}
            submitLabel="Save changes"
          />
        </div>
      ) : (
        <p className="mt-8 text-sm text-slate-600">This report is no longer available.</p>
      )}
    </div>
  );
}