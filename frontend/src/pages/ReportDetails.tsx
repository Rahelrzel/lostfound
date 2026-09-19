import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../app/store';
import { fetchReports, deleteReport } from '../features/reports/reportsSlice';
import { CATEGORY_ICONS } from '../types';
import Loading from '../components/Loading';
// ConfirmModal is built by teammate (components/ConfirmModal.tsx) — plugs in as-is.
import ConfirmModal from '../components/ConfirmModal';

export default function ReportDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { items, loading } = useSelector((state: RootState) => state.reports);
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (items.length === 0) dispatch(fetchReports());
  }, [dispatch, items.length]);

  const report = items.find((r) => r._id === id);

  if (loading) return <Loading />;

  if (!report) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16 text-center text-gray-500">
        Report not found. <Link to="/reports" className="text-green-700 underline">Back to reports</Link>
      </div>
    );
  }

  const isOwner = currentUser?._id === report.createdBy._id;

  const handleDelete = () => {
    dispatch(deleteReport(report._id));
    navigate('/reports');
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <div className="rounded-lg overflow-hidden border border-gray-200">
        <div className="relative h-72 bg-gray-100">
          <img src={report.imageUrl} alt={report.title} className="w-full h-full object-cover" />
          <span
            className={`absolute top-3 left-3 text-xs font-semibold px-2 py-1 rounded ${
              report.type === 'LOST' ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
            }`}
          >
            {report.type}
          </span>
          {report.status === 'RESOLVED' && (
            <span className="absolute top-3 right-3 text-xs font-semibold px-2 py-1 rounded bg-gray-700 text-white">
              RESOLVED
            </span>
          )}
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-2xl font-semibold text-gray-900">{report.title}</h1>
            {isOwner && (
              <div className="flex gap-2 shrink-0">
                <Link
                  to={`/report/${report._id}/edit`}
                  className="text-sm font-medium border border-gray-300 rounded-md px-3 py-1.5 hover:bg-gray-50"
                >
                  Edit
                </Link>
                <button
                  onClick={() => setShowConfirm(true)}
                  className="text-sm font-medium border border-red-300 text-red-600 rounded-md px-3 py-1.5 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            )}
          </div>

          <p className="text-sm text-gray-500 mt-1">
            {CATEGORY_ICONS[report.category]} {report.category} · {report.location} ·{' '}
            {new Date(report.date).toLocaleDateString()}
          </p>

          <p className="text-gray-700 mt-4 leading-relaxed">{report.description}</p>

          <div className="mt-6 border-t border-gray-200 pt-4">
            <h2 className="text-sm font-semibold text-gray-900 mb-2">Reporter</h2>
            <p className="text-sm text-gray-600">{report.createdBy.name}</p>
            <p className="text-sm text-gray-600">{report.createdBy.phone}</p>
            <p className="text-sm text-gray-600">{report.createdBy.email}</p>
          </div>
        </div>
      </div>

      {showConfirm && (
        <ConfirmModal
          message={`Delete "${report.title}"? This can't be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
}