import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../app/store';
import {
  fetchReports,
  deleteReport,
  markResolved,
} from '../features/reports/reportsSlice';
import { CATEGORY_ICONS } from '../types';
import Loading from '../components/Loading';
import ConfirmModal from '../components/ConfirmModal';

const FALLBACK_IMAGE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="100%" height="100%" fill="#f3f4f6"/><text x="50%" y="50%" fill="#9ca3af" font-family="sans-serif" font-size="20" text-anchor="middle">No image</text></svg>'
  );

function formatDate(value: string): string {
  const d = new Date(value);
  return isNaN(d.getTime()) ? 'Unknown date' : d.toLocaleDateString();
}

export default function ReportDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { items, loading } = useSelector((state: RootState) => state.reports);
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (items.length === 0 && !loading) dispatch(fetchReports());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const report = items.find((r) => r._id === id);

  if (loading && !report) return <Loading />;

  if (!report) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16 text-center text-gray-500">
        Report not found.{' '}
        <Link to="/reports" className="text-green-700 underline">
          Back to reports
        </Link>
      </div>
    );
  }

  const reporter = report.createdBy;
  const isOwner = !!currentUser?._id && currentUser._id === reporter?._id;
  const isResolved = report.status === 'RESOLVED';

  const handleDelete = () => {
    dispatch(deleteReport(report._id));
    setShowConfirm(false);
    navigate('/reports');
  };

  const handleResolve = () => {
    dispatch(markResolved(report._id));
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-green-700 hover:underline mb-4"
      >
        ← Back
      </button>

      <div className="rounded-lg overflow-hidden border border-gray-200 bg-white">
        <div className="relative h-72 bg-gray-100">
          <img
            src={report.imageUrl || FALLBACK_IMAGE}
            alt={report.title}
            onError={(e) => {
              e.currentTarget.src = FALLBACK_IMAGE;
            }}
            className="w-full h-full object-cover"
          />
          <span
            className={`absolute top-3 left-3 text-xs font-semibold px-2 py-1 rounded ${
              report.type === 'LOST' ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
            }`}
          >
            {report.type}
          </span>
          {isResolved && (
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
                  to={`/reports/${report._id}/edit`}
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
            {formatDate(report.date)}
          </p>

          <p className="text-gray-700 mt-4 leading-relaxed whitespace-pre-line">
            {report.description}
          </p>

          {isOwner && !isResolved && (
            <button
              onClick={handleResolve}
              className="mt-4 text-sm font-medium bg-green-700 text-white rounded-md px-4 py-2 hover:bg-green-800"
            >
              Mark as resolved
            </button>
          )}

          <div className="mt-6 border-t border-gray-200 pt-4">
            <h2 className="text-sm font-semibold text-gray-900 mb-2">Reporter</h2>
            {reporter ? (
              <div className="space-y-1 text-sm text-gray-600">
                <p>{reporter.name}</p>
                {reporter.phone && (
                  <p>
                    <a href={`tel:${reporter.phone}`} className="hover:underline">
                      {reporter.phone}
                    </a>
                  </p>
                )}
                {reporter.email && (
                  <p>
                    <a href={`mailto:${reporter.email}`} className="hover:underline">
                      {reporter.email}
                    </a>
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Reporter details unavailable.</p>
            )}
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showConfirm}
        title="Delete report"
        message={`Delete "${report.title}"? This can't be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
}