import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../app/store';
import { fetchReports } from '../features/reports/reportsSlice';
import { CATEGORIES, CATEGORY_ICONS, Category, ReportType } from '../types';
import ReportCard from '../components/ReportCard';
import Loading from '../components/Loading';

export default function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading } = useSelector((state: RootState) => state.reports);

  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [activeType, setActiveType] = useState<ReportType>('LOST');

  useEffect(() => {
    dispatch(fetchReports());
  }, [dispatch]);

  const goToReports = (params: Record<string, string>) => {
    const query = new URLSearchParams(params).toString();
    navigate(`/reports?${query}`);
  };

  const handleSearch = () => {
    const params: Record<string, string> = { type: activeType };
    if (search) params.search = search;
    if (location) params.location = location;
    if (date) params.date = date;
    goToReports(params);
  };

  const handleCategoryClick = (category: Category) => {
    goToReports({ type: activeType, category });
  };

  const recentReports = [...items]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  return (
    <div>
      <section className="bg-green-700 text-white px-6 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold">Find what's lost. Return what's found.</h1>
          <p className="mt-2 text-green-100">A community board for lost and found items around you.</p>

          <div className="mt-8 bg-white rounded-lg p-4 flex flex-col md:flex-row gap-3 text-left">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="What are you looking for?"
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900"
            />
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location"
              className="md:w-40 border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900"
            />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="md:w-40 border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900"
            />
            <button
              onClick={handleSearch}
              className="bg-green-700 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-green-800"
            >
              Search
            </button>
          </div>

          <div className="mt-6 inline-flex bg-green-800 rounded-md overflow-hidden">
            <button
              onClick={() => setActiveType('LOST')}
              className={`px-6 py-2 text-sm font-medium ${activeType === 'LOST' ? 'bg-white text-green-800' : 'text-white'}`}
            >
              Lost
            </button>
            <button
              onClick={() => setActiveType('FOUND')}
              className={`px-6 py-2 text-sm font-medium ${activeType === 'FOUND' ? 'bg-white text-green-800' : 'text-white'}`}
            >
              Found
            </button>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-10">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Browse by category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className="flex flex-col items-center justify-center gap-2 border border-gray-200 rounded-lg py-6 hover:border-green-600 hover:bg-green-50 transition-colors"
            >
              <span className="text-3xl">{CATEGORY_ICONS[cat]}</span>
              <span className="text-sm font-medium text-gray-700">{cat}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-16">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent reports</h2>
        {loading ? (
          <Loading />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {recentReports.map((report) => (
              <ReportCard key={report._id} report={report} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}