import { Link } from 'react-router-dom';
import { CATEGORY_ICONS, Report } from '../types';

export default function ReportCard({ report }: { report: Report }) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow">
      <div className="relative h-40 bg-gray-100">
        <img src={report.imageUrl} alt={report.title} className="w-full h-full object-cover" />
        <span
          className={`absolute top-2 left-2 text-xs font-semibold px-2 py-1 rounded ${
            report.type === 'LOST' ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
          }`}
        >
          {report.type}
        </span>
      </div>

      <div className="p-3">
        <h3 className="font-medium text-gray-900 truncate">{report.title}</h3>
        <p className="text-sm text-gray-500 mt-0.5">
          {CATEGORY_ICONS[report.category]} {report.category} · {report.location}
        </p>
        <p className="text-xs text-gray-400 mt-1">{new Date(report.date).toLocaleDateString()}</p>

        <Link
          to={`/reports/${report._id}`}
          className="mt-3 block text-center text-sm font-medium border border-gray-300 rounded-md py-1.5 hover:bg-gray-50"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}